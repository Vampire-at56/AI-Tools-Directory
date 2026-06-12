import { blogs } from "../data/blogs";

export default function sitemap() {
  const baseUrl = "https://ai-tools-directory-mocha.vercel.app";

  const staticPages = [
    "",
    "/blog",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/submit-tool",
    "/login",
    "/signup",
  ];

  const staticRoutes = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page === "" ? 1 : 0.8,
  }));

  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}