export interface WpPost {
  id: number;
  date: string;
  modified: string;
  link: string;

  slug: string;
  status: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{ name: string }>;

    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}


export interface BlogPost extends Record<string, unknown> {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: Date;
  modifiedDate: Date;
  author: string;
  featuredImage: featuredImage | null;
  categories: string[];
  tags: string[];
  wpId: number;
  link: string;
}
export interface featuredImage {
  url: string;
  altText: string;
}
export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WpMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<string, {
      source_url: string;
      width: number;
      height: number;
    }>;
  };
}


export interface WpSiteData {
  custom_logo: { url: string, width: number, height: number, alt: string };
  custom_header: string;
  favicon: string;
}

export interface WpMenu {
  id: string;
  name: string;
  slug: string;
  count: number;
  items: WpMenuItem[];
}
export interface WpMenuItem {
  id: number;
  title: string;
  url: string;
  target: string;
  classes: string[];
  object_id: string;
  object: string;
  type: string;
}

export interface MenuItem {
  label: string;
  path: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
};