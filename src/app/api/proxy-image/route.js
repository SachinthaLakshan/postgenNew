export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url'); // Do NOT decode yet

  if (!url) {
      return new Response(JSON.stringify({ error: 'Missing image URL' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
      });
  }

  try {
      // console.log('Fetching image from:', url); // Log the original URL

      const response = await fetch(url, { // Use the URL as-is
          headers: { 
              'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
              'Accept': 'image/*'
          },
          redirect: 'follow'
      });

      if (!response.ok) {
          console.error('Fetch failed:', response.status, response.statusText);
          return new Response(JSON.stringify({ 
              error: 'Failed to fetch image',
              status: response.status,
              statusText: response.statusText,
              url: url // Return original URL for debugging
          }), {
              status: response.status,
              headers: { 'Content-Type': 'application/json' }
          });
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
          return new Response(JSON.stringify({ 
              error: 'URL does not point to an image',
              contentType: contentType
          }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
          });
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      return new Response(buffer, {
          headers: {
              'Content-Type': contentType,
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=60'
          }
      });
  } catch (error) {
      // console.error('Proxy error:', error);
      return new Response(JSON.stringify({ 
          error: 'Image proxy failed',
          details: error.message,
          url: url
      }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
      });
  }
}