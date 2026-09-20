async function test() {
  const url = 'http://localhost:3005/watch/movie/1108427-moana';
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  console.log(`HTTP Status: ${res.status}`);

  const html = await res.text();

  // Extract title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');

  // Extract description
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  console.log('Meta Description:', descMatch ? descMatch[1] : 'NOT FOUND');

  // Extract canonical
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
  console.log('Canonical:', canonicalMatch ? canonicalMatch[1] : 'NOT FOUND');

  // Extract H1
  const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/);
  console.log('H1:', h1Match ? h1Match[1] : 'NOT FOUND');

  // Extract JSON-LD scripts
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  let count = 0;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    count++;
    try {
      const parsed = JSON.parse(match[1]);
      console.log(`JSON-LD #${count} Type:`, parsed['@type']);
      if (parsed['@type'] === 'Movie' || parsed['@type'] === 'TVSeries') {
        console.log('  Name:', parsed.name);
        console.log('  Description snippet:', (parsed.description || '').slice(0, 60) + '...');
        console.log('  Actors count:', parsed.actor ? parsed.actor.length : 0);
      } else if (parsed['@type'] === 'VideoObject') {
        console.log('  Video Name:', parsed.name);
        console.log('  Embed URL:', parsed.embedUrl);
      } else if (parsed['@type'] === 'BreadcrumbList') {
        console.log('  Breadcrumb Items:', parsed.itemListElement.map(i => i.name).join(' > '));
      }
    } catch (e) {
      console.error(`Failed to parse JSON-LD #${count}:`, e.message);
    }
  }

  // Check storyline text in HTML
  const hasStoryline = html.includes('Storyline &amp; Overview') || html.includes('Storyline & Overview');
  console.log('Has Storyline section in SSR HTML:', hasStoryline);

  // Test 404 behavior on non-existent title
  const badUrl = 'http://localhost:3005/watch/movie/999999999-not-exist';
  console.log(`\nTesting non-existent title: ${badUrl}`);
  const badRes = await fetch(badUrl);
  console.log(`HTTP Status for missing title: ${badRes.status} (Expected 404)`);

  // Test home page
  const homeUrl = 'http://localhost:3005/';
  console.log(`\nTesting Home: ${homeUrl}`);
  const homeRes = await fetch(homeUrl);
  console.log(`Home Status: ${homeRes.status}`);
  const homeHtml = await homeRes.text();
  const homeH1 = homeHtml.match(/<h1[^>]*>([^<]*)<\/h1>/);
  console.log('Home H1:', homeH1 ? homeH1[1].trim() : 'NOT FOUND');
  // Test backward-compatibility for raw ID URL
  const oldUrl = 'http://localhost:3005/watch/movie/1108427';
  console.log(`\nTesting raw ID URL (backward-compatibility): ${oldUrl}`);
  const oldRes = await fetch(oldUrl);
  console.log(`Old ID Status: ${oldRes.status}`);
  const oldHtml = await oldRes.text();
  const oldCanonical = oldHtml.match(/<link rel="canonical" href="([^"]*)"/);
  console.log('Old ID URL self-corrects canonical to:', oldCanonical ? oldCanonical[1] : 'NOT FOUND');
}

test().catch(console.error);
