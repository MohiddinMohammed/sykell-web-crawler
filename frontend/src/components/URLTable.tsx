import React from 'react';
import { CrawlResult } from '../types';
import { Link } from 'react-router-dom';

interface Props {
  data: CrawlResult[];
  selectedUrls: string[];
  onSelect: (url: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

const URLTable: React.FC<Props> = ({ data, selectedUrls, onSelect, onSelectAll }) => {
  if (data.length === 0) return <p>No URLs crawled yet.</p>;

  return (
    <table style={{ borderCollapse: 'collapse', width: '85%' }}>
      <thead>
        <tr>
<th style={th}>
  <input
    type="checkbox"
    onChange={(e) => onSelectAll(e.target.checked)}
  />
</th>
          <th style={th}>Title</th>
          <th style={th}>HTML Version</th>
          <th style={th}>Internal Links</th>
          <th style={th}>External Links</th>
          <th style={th}>Broken Links</th>
          <th style={th}>Login Form</th>
          <th style={th}>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
          <td style={td}>
  <input
    type="checkbox"
    checked={selectedUrls.includes(row.url)}
    onChange={(e) => onSelect(row.url, e.target.checked)}
  />
</td>
            <td style={td}>
              <Link to={`/investor/${encodeURIComponent(row.url)}`}>
                {row.title || row.url}
              </Link>
            </td>
            <td style={td}>{row.html_version}</td>
            <td style={td}>{row.internal_links.length}</td>
            <td style={td}>{row.external_links.length}</td>
            <td style={td}>{row.broken_links.length}</td>
            <td style={td}>{row.has_login_form ? 'Yes' : 'No'}</td>
            <td style={td}>
  <span style={{
    padding: '0.25rem 0.5rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    fontSize: '0.85rem'
  }}>
    Done
  </span>
</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const th = {
  border: '1px solid #ccc',
  padding: '0.75rem',
  backgroundColor: '#f8f8f8',
  textAlign: 'left' as const,
};

const td = {
  border: '1px solid #ddd',
  padding: '0.75rem',
};

export default URLTable;
