import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p','a','h1','h2','h3','h4','br','strong','em','ul','ol','li','blockquote','img','hr','span','div','table','thead','tbody','tr','th','td','figure','figcaption'],
    ALLOWED_ATTR: ['href','title','alt','src','class','id','target','rel','width','height','loading','style']
  });
}
