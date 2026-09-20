async function testTv() {
  const url = 'http://localhost:3005/watch/tv/108978-reacher';
  console.log(`\nFetching TV Series: ${url}...`);
  const res = await fetch(url);
  console.log(`HTTP Status: ${res.status}`);

  const html = await res.text();
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  console.log('TV Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');

  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
  console.log('TV Canonical:', canonicalMatch ? canonicalMatch[1] : 'NOT FOUND');

  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      console.log(`TV JSON-LD Type: ${parsed['@type']} | Name: ${parsed.name}`);
    } catch {}
  }
}

testTv().catch(console.error);
