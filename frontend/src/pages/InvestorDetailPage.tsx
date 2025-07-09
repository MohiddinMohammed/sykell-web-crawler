import React from 'react';
import { useParams } from 'react-router-dom';
import { CrawlResult } from '../types';
import LinkBreakdownChart from '../components/Charts/LinkBreakdownChart';

interface Props {
  data?: CrawlResult[];
}

const InvestorDetailPage: React.FC<Props> = () => {
  const { url } = useParams();
  const decodedUrl = decodeURIComponent(url || '');
  const cachedData = JSON.parse(localStorage.getItem('crawlResults') || '[]') as CrawlResult[];
  const crawlData = cachedData.find(d => d.url === decodedUrl);
  console.log('Detail Data:', crawlData);
  if (!crawlData) {
    return <p>Data not found for this URL.</p>;
  }

  const { title, html_version, has_login_form, internal_links, external_links, broken_links } = crawlData;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{title || decodedUrl}</h2>
      <p><strong>HTML Version:</strong> {html_version}</p>
      <p><strong>Login Form Present:</strong> {has_login_form ? 'Yes' : 'No'}</p>
      <h3>Headings Summary</h3>
<p>
  {Object.entries(crawlData.headings)
    .filter(([_, count]) => count > 0)
    .map(([tag, count]) => `${tag.toUpperCase()}: ${count}`)
    .join(', ') || 'No headings found.'}
</p>

      <h3>🔍 Link Breakdown</h3>
      <LinkBreakdownChart
        internalCount={internal_links.length}
        externalCount={external_links.length}
      />

      <h3 style={{ marginTop: '2rem' }}> Broken Links</h3>
      {broken_links.length === 0 ? (
        <p>No broken links detected.</p>
      ) : (
        <ul>
          {broken_links.map((b, i) => (
            <li key={i}>
              {typeof b === 'string' ? b : `${b.url} (${b.status})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvestorDetailPage;
