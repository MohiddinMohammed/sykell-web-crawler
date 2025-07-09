import React, { useState } from 'react';
import AddUrlForm from '../components/AddUrlForm';
import URLTable from '../components/URLTable';
import { crawlUrl } from '../api/crawler';
import { CrawlResult } from '../types';

const DashboardPage = () => {
  const [results, setResults] = useState<CrawlResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReCrawling, setIsReCrawling] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [htmlVersionFilter, setHtmlVersionFilter] = useState('');
  const [loginFilter, setLoginFilter] = useState('');

  const handleCrawlSubmit = async (url: string) => {
  setLoading(true);
  setError('');

  try {
    const response = await crawlUrl(url);
    const resultWithUrl = { ...response.data, url };

    setResults(prev => {
      const newResults = [resultWithUrl, ...prev];

      localStorage.setItem('crawlResults', JSON.stringify(newResults));

      return newResults;
    });
  } catch (err) {
    console.error(' Crawl error:', err);
    setError('Failed to crawl URL. Please try again.');
  }

  setLoading(false);
};
const spinnerStyle = {
  border: '4px solid #eee',
  borderTop: '4px solid #007bff',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  animation: 'spin 1s linear infinite',
  margin: '1rem auto'
} as React.CSSProperties;

const handleSelect = (url: string, checked: boolean) => {
  setSelectedUrls(prev =>
    checked ? [...prev, url] : prev.filter(u => u !== url)
  );
};

const handleSelectAll = (checked: boolean) => {
  setSelectedUrls(checked ? results.map(r => r.url) : []);
};
const filteredResults = results.filter(r => {
  const matchesSearch =
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.url.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesHtml = htmlVersionFilter ? r.html_version === htmlVersionFilter : true;
  const matchesLogin =
    loginFilter === ''
      ? true
      : loginFilter === 'yes'
      ? r.has_login_form
      : !r.has_login_form;

  return matchesSearch && matchesHtml && matchesLogin;
});

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>🌐 Website Crawler Dashboard</h1>
      <AddUrlForm onSubmit={handleCrawlSubmit} />
      {loading && (
  <div style={spinnerStyle} />
)}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isReCrawling && <p> Re-crawling selected URLs...</p>}
      <div style={{ marginBottom: '1rem' }}>
  <button
  onClick={async () => {
    console.log(' Re-crawl started for:', selectedUrls);
    setIsReCrawling(true);

    try {
      const updatedResults = await Promise.all(
        selectedUrls.map(async (url) => {
          console.log(' Crawling:', url);
          const res = await crawlUrl(url);
          const result = { ...res.data, url };
          console.log('Crawled:', result);
          return result;
        })
      );

      setResults(prev =>
        prev.map(r => {
          const match = updatedResults.find(u => u.url === r.url);
          return match ? match : r;
        })
      );

      localStorage.setItem('crawlResults', JSON.stringify(results));
      console.log(' Results updated');
    } catch (err) {
      console.error('Re-crawl failed:', err);
    }

    setIsReCrawling(false);
  }}
  style={{
    marginRight: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e0a800')}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffc107')}
>
  Re-crawl Selected
</button>

<button
  onClick={() => {
    const filtered = results.filter(r => !selectedUrls.includes(r.url));
    setResults(filtered);
    setSelectedUrls([]);
    localStorage.setItem('crawlResults', JSON.stringify(filtered));
  }}
  style={{
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c82333')}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
>
  Delete Selected
</button>

</div>
<div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
  <input
    type="text"
    placeholder="Search by title or URL"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ padding: '0.5rem', width: '250px' }}
  />

  <select
    value={htmlVersionFilter}
    onChange={(e) => setHtmlVersionFilter(e.target.value)}
    style={{ padding: '0.5rem' }}
  >
    <option value="">All HTML Versions</option>
    <option value="HTML5">HTML5</option>
    <option value="HTML 4.01">HTML 4.01</option>
    <option value="XHTML 1.0">XHTML 1.0</option>
    <option value="HTML 3.2">HTML 3.2</option>
  </select>

  <select
    value={loginFilter}
    onChange={(e) => setLoginFilter(e.target.value)}
    style={{ padding: '0.5rem' }}
  >
    <option value="">All</option>
    <option value="yes">Has Login Form</option>
    <option value="no">No Login Form</option>
  </select>
</div>

      <URLTable
        data={filteredResults}
        selectedUrls={selectedUrls}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
      />

    </div>
  );
};

export default DashboardPage;
