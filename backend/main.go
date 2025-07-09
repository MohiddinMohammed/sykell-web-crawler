package main

import (
	"bytes"
	"github.com/PuerkitoBio/goquery"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
	"sync"
    "net/url"
    "fmt"
)

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	r.POST("/crawl", func(c *gin.Context) {
		var json struct {
			URL string `json:"url"`
		}

		if err := c.BindJSON(&json); err != nil || json.URL == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON or missing URL"})
			return
		}

		resp, err := http.Get(json.URL)
if err != nil {
	log.Println("❌ Fetch error:", err)
	c.JSON(http.StatusBadGateway, gin.H{"error": "Failed to fetch URL"})
	return
}
defer resp.Body.Close()

// Read body once
bodyBytes, err := io.ReadAll(resp.Body)
if err != nil {
	log.Println("❌ Read error:", err)
	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read body"})
	return
}
bodyReader := bytes.NewReader(bodyBytes)
bodyString := string(bodyBytes)

//HTML version logic
htmlVersion := "Unknown"
lower := strings.ToLower(bodyString)
switch {
case strings.Contains(lower, "<!doctype html>"):
	htmlVersion = "HTML5"
case strings.Contains(lower, "-//w3c//dtd html 4.01"):
	htmlVersion = "HTML 4.01"
case strings.Contains(lower, "-//w3c//dtd xhtml 1.0"):
	htmlVersion = "XHTML 1.0"
case strings.Contains(lower, "-//w3c//dtd html 3.2"):
	htmlVersion = "HTML 3.2"
}

// Use new reader for goquery
doc, err := goquery.NewDocumentFromReader(bodyReader)
if err != nil {
	log.Println("❌ Parse error:", err)
	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse HTML"})
	return
}
		title := doc.Find("title").Text()

headingsCount := map[string]int{
	"h1": 0,
	"h2": 0,
	"h3": 0,
	"h4": 0,
	"h5": 0,
	"h6": 0,
}

// Count each heading level
for tag := range headingsCount {
	doc.Find(tag).Each(func(i int, s *goquery.Selection) {
		headingsCount[tag]++
	})
}

		parsedURL, err := url.Parse(json.URL)
if err != nil {
	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid base URL"})
	return
}

var (
	internalLinks []string
	externalLinks []string
	brokenLinks   []string
	wg            sync.WaitGroup
	mutex         sync.Mutex
)

doc.Find("a").Each(func(i int, s *goquery.Selection) {
	href, exists := s.Attr("href")
	if exists && href != "" {
		// Normalize relative URLs
		linkURL, err := url.Parse(href)
		if err != nil {
			return
		}

		finalURL := parsedURL.ResolveReference(linkURL).String()

		// Categorize link
		if linkURL.Host == "" || linkURL.Host == parsedURL.Host {
			internalLinks = append(internalLinks, finalURL)
		} else {
			externalLinks = append(externalLinks, finalURL)
		}

		// Check if broken
		wg.Add(1)
		go func(link string) {
			defer wg.Done()
			resp, err := http.Head(link)
			if err != nil || (resp.StatusCode >= 400 && resp.StatusCode <= 599) {
				mutex.Lock()
				brokenLinks = append(brokenLinks, fmt.Sprintf("%s (%d)", link, resp.StatusCode))
				mutex.Unlock()
			}
			if resp != nil {
				resp.Body.Close()
			}
		}(finalURL)
	}
})
wg.Wait()

		// Meta tags: description & keywords
		description, _ := doc.Find(`meta[name="description"]`).Attr("content")

hasLoginForm := false
doc.Find("input[type='password']").Each(func(i int, s *goquery.Selection) {
	hasLoginForm = true
})

		c.JSON(http.StatusOK, gin.H{
			"title":       title,
			"headings":    headingsCount,
			"internal_links": internalLinks,
            "external_links": externalLinks,
            "broken_links":  brokenLinks,
			"description": description,
			"html_version": htmlVersion,
			"has_login_form": hasLoginForm,
		})
	})

	r.Run(":8080")
}
