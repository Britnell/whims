import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

interface WordPressPost {
  "wp:post_id": string | number;
  title: string;
  "wp:post_name": string | { __cdata: string };
  "wp:post_date": string | { __cdata: string };
  "wp:post_type": string | { __cdata: string };
  "wp:status": string | { __cdata: string };
  link: string;
  "content:encoded": string | { __cdata: string };
  "excerpt:encoded": string | { __cdata: string };
  category: Category | Category[];
}

interface Category {
  domain: string;
  __cdata?: string;
  "#text"?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: Date;
  link: string;
  content: string;
  excerpt: string;
  categories: string[];
  tags: string[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  textNodeName: "#text",
  cdataPropName: "__cdata",
});

const xmlContent = readFileSync(join(__dirname, "../../export.xml"), "utf-8");
const result = parser.parse(xmlContent);

const channel = result.rss.channel;
const items: WordPressPost[] = Array.isArray(channel.item)
  ? channel.item
  : [channel.item];

const posts: Post[] = items
  .filter((item: WordPressPost) => {
    const postType =
      typeof item["wp:post_type"] === "string"
        ? item["wp:post_type"]
        : item["wp:post_type"].__cdata;
    const status =
      typeof item["wp:status"] === "string"
        ? item["wp:status"]
        : item["wp:status"].__cdata;
    return postType === "post" && status === "publish";
  })
  .map((item: WordPressPost) => {
    const categories = Array.isArray(item.category)
      ? item.category
          .filter((cat: Category) => cat.domain === "category")
          .map((cat: Category) => cat.__cdata || cat["#text"] || "")
      : item.category?.domain === "category"
        ? [item.category.__cdata || item.category["#text"] || ""]
        : [];

    const tags = Array.isArray(item.category)
      ? item.category
          .filter((cat: Category) => cat.domain === "post_tag")
          .map((cat: Category) => cat.__cdata || cat["#text"] || "")
      : item.category?.domain === "post_tag"
        ? [item.category.__cdata || item.category["#text"] || ""]
        : [];

    const postId =
      typeof item["wp:post_id"] === "string"
        ? item["wp:post_id"]
        : String(item["wp:post_id"]);
    const slug =
      typeof item["wp:post_name"] === "string"
        ? item["wp:post_name"]
        : item["wp:post_name"].__cdata;
    const postDate =
      typeof item["wp:post_date"] === "string"
        ? item["wp:post_date"]
        : item["wp:post_date"].__cdata;

    return {
      id: postId,
      title: item.title,
      slug: slug,
      date: new Date(postDate),
      link: item.link,
      content:
        typeof item["content:encoded"] === "string"
          ? item["content:encoded"]
          : item["content:encoded"]?.__cdata || "",
      excerpt:
        typeof item["excerpt:encoded"] === "string"
          ? item["excerpt:encoded"]
          : item["excerpt:encoded"]?.__cdata || "",
      categories,
      tags,
    };
  });

posts.sort((a: Post, b: Post) => b.date.getTime() - a.date.getTime());

export function getPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post: Post) => post.slug === slug);
}
