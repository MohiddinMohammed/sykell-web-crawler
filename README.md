# Sykell Web Crawler

🚀 A full-stack web crawling dashboard that scans any URL and presents structured insights, built for the Sykell Frontend Full Stack Challenge.

---

## 🌐 Features

-  **URL Crawling Dashboard**
  - Enter any URL to crawl
  - Displays metadata like:
    - HTML version
    - Title
    - Internal / External / Broken links
    - Login form detection
    - Crawl status

-   **Investor Detail Page**
  - Click any crawled URL to view a breakdown:
    - Pie chart for link distribution
    - Full result summary

-   **Bulk Actions**
  - Select multiple URLs to:
    -  Re-crawl
    - ️ Delete

-   **Global Search + Column Filters**
  - Search by title or URL (fuzzy matching)
  - Filter by status, login presence, etc.

-   **Beautiful UI**
  - Fully responsive
  - Clear button states, loading spinners, visual feedback
  - Easy to extend for production use

---

##  ️ Tech Stack

| Layer       | Tech               |
|-------------|--------------------|
| **Frontend**| React + TypeScript |
| **Backend** | Go (Gin framework) |
| **Charts**  | Recharts (Pie Chart) |
| **Styling** | CSS Modules        |
| **Versioning** | Git & GitHub    |

---

##   How to Run Locally

###   Backend (Go + Gin)

1. Navigate to the backend folder:

```bash
cd backend
go run main.go
