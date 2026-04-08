export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const ua = req.headers.get('user-agent') || '';
  const isBot = /facebook|facebot|whatsapp|twitter|linkedin|telegram|discord/i.test(ua);

  if (isBot) {
    const productId = url.pathname.split('/').filter(Boolean).pop();
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const res = await fetch(`${API_URL}/Products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        const html = `<!DOCTYPE html><html><head>
          <meta charset="utf-8">
          <meta property="og:title" content="${data.name}" />
          <meta property="og:description" content="${data.info || ''}" />
          <meta property="og:image" content="${data.imageURL || "https://res.cloudinary.com/dmzyuywuy/image/upload/v1774028116/i4fo794o2e10b2rawqap.png" }" />
          <meta property="og:url" content="${url.href}" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
        </head><body></body></html>`;

        return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    } catch (e) { console.error(e); }
  }
  return new Response("Not a bot", { status: 200 });
}