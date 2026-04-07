export async function middleware(req) {
  const url = new URL(req.url);
  const userAgent = req.headers.get('user-agent') || '';
  const isBot = /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|TelegramBot/i.test(userAgent);

  if (isBot && url.pathname.startsWith('/produkt/')) {
    const productId = url.pathname.split('/').pop();
    const BACKEND_URL = process.env.REACT_APP_API_URL; 
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const apiResponse = await fetch(`${BACKEND_URL}/Products/${productId}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!apiResponse.ok) throw new Error('Produkt nenalezen');
      const data = await apiResponse.json();
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta property="og:title" content="${data.name}" />
            <meta property="og:description" content="${data.info || 'Prohlédněte si tento produkt v našem katalogu'}" />
            <meta property="og:image" content="${data.imageURL}" />
            <meta property="og:url" content="${url.href}" />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${data.name}" />
            <meta name="twitter:image" content="${data.imageURL}" />
          </head>
          <body></body>
        </html>
      `;
      return new NextResponse(html, {
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 's-maxage=3600, stale-while-revalidate' 
        },
      });
    } catch (error) {
      console.error("Middleware fetch error:", error.message);
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

export const config = {
  runtime: 'edge', 
  matcher: ['/produkt/:path*'], 
};