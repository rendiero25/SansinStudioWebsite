/**
 * Sanitizes HTML string from React Quill (or other sources).
 * Specifically addresses the issue of non-breaking spaces causing overflow.
 * 
 * @param html The raw HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";
  // Replace non-breaking spaces (\u00A0 or &nbsp;) with regular spaces
  // to allow proper word-wrapping in the browser.
  return html.replace(/\u00A0|&nbsp;/g, " ");
};
