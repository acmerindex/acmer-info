/**
 * Checks if a navigation link is currently active based on the pathname.
 * Supports multiple path formats:
 * - Regular: /groups
 * - Trailing slash: /groups/
 * - Static export: /groups.html
 */
export function isNavLinkActive(pathname: string, href: string): boolean {
  return (
    pathname === href ||
    pathname === `${href}/` ||
    pathname === `${href}.html`
  );
}
