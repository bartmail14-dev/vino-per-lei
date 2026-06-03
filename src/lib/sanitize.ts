import sanitize from "sanitize-html";

export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [
      "p",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "br",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "blockquote",
      "img",
      "hr",
      "span",
      "div",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "figure",
      "figcaption",
    ],
    allowedAttributes: {
      "*": ["class", "id", "title"],
      a: ["href", "target", "rel"],
      img: ["alt", "src", "width", "height", "loading"],
      th: ["scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["https"],
    },
    transformTags: {
      a: sanitize.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
    exclusiveFilter: (frame) => {
      if (frame.tag !== "img") return false;

      const src = frame.attribs.src;
      if (!src) return true;

      try {
        const parsed = new URL(src);
        return !["cdn.shopify.com", "images.unsplash.com"].includes(parsed.hostname);
      } catch {
        return true;
      }
    },
  });
}
