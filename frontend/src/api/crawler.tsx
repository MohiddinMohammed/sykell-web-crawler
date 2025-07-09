import axios from 'axios';

export const crawlUrl = async (url: string) => {
  return axios.post('http://localhost:8080/crawl', { url });
};
