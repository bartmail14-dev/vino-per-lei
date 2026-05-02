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
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    transformTags: {
      a: sanitize.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  });
}
