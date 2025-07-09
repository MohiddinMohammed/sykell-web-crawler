import React, { useState } from 'react';

interface Props {
  onSubmit: (url: string) => void;
}

export default function AddUrlForm({ onSubmit }: Props) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    setError('');
    onSubmit(url);
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        value={url}
        placeholder="Enter website URL"
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: '0.5rem', width: '400px' }}
      />
      <button
    type="submit"
    style={{
    marginLeft: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }}
>
  Crawl
</button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
}
