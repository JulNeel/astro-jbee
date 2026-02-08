// Strapi v5 API response wrapper
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Strapi media type
export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// Strapi user (from users-permissions plugin)
export interface StrapiUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
}

// Strapi tag/category
export interface StrapiTag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

// Strapi Blocks editor types (type: "blocks")
export type BlockNode =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | ImageBlock
  | CodeBlock
  | QuoteBlock;

export interface TextChild {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface LinkChild {
  type: "link";
  url: string;
  children: TextChild[];
}

export type InlineNode = TextChild | LinkChild;

export interface ParagraphBlock {
  type: "paragraph";
  children: InlineNode[];
}

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: InlineNode[];
}

export interface ListBlock {
  type: "list";
  format: "ordered" | "unordered";
  children: ListItemBlock[];
}

export interface ListItemBlock {
  type: "list-item";
  children: InlineNode[];
}

export interface ImageBlock {
  type: "image";
  image: StrapiMedia;
}

export interface CodeBlock {
  type: "code";
  children: TextChild[];
}

export interface QuoteBlock {
  type: "quote";
  children: InlineNode[];
}

// Raw Strapi post structure
export interface StrapiPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: StrapiMedia | null;
  author: StrapiUser | null;
  content: string | null;
  tags: StrapiTag[] | null;
  categories: StrapiCategory[] | null;
  GenerateTableOfContent: boolean | null;
  wpCreatedAt: string | null;
  wpUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Menu item type (for static menu)
export interface MenuItem {
  id: number;
  title: string;
  url: string;
}

// Strapi ressource category
export interface StrapiRessourceCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

// Raw Strapi ressource structure
export interface StrapiRessource {
  id: number;
  documentId: string;
  Title: string;
  Slug: string;
  Thumbnail: StrapiMedia | null;
  Description: string | null;
  Link: string | null;
  Language: "Français" | "Anglais" | null;
  tags: StrapiTag[] | null;
  ressource_category: StrapiRessourceCategory | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Raw Strapi page structure
export interface StrapiPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Raw Strapi about singleType structure
export interface StrapiAbout {
  id: number;
  documentId: string;
  picture: StrapiMedia | null;
  name: string | null;
  firstName: string | null;
  description: string | null;
  linkedinProfileUrl: string | null;
  githubProfileUrl: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

