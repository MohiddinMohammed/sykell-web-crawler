export interface CrawlResult {
  url: string;
  title: string;
  html_version: string;
  has_login_form: boolean;
  headings: { [key: string]: number };
  internal_links: string[];
  external_links: string[];
  broken_links: { url: string; status: number }[];
  description?: string;
}
