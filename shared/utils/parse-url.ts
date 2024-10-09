export function parseUrl(url: string) {
  const parsedUrl = new URL(url);

  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname
    .split('/')
    .slice(0, 2)
    .join('/')}`;

  const shortName = parsedUrl.pathname.split('/')[2] || undefined;

  const startParam =
    parsedUrl.searchParams.get('startapp') ||
    parsedUrl.searchParams.get('start') ||
    '';

  return { baseUrl, shortName, startParam };
}
