# Cloudflare Workers urlscan.io Script
Cloudflare Workers urlscan.io submission script. This script provides an easy-to-use mechanism to submit urls to urlscan.io via Cloudflare Workers. Handy if deployed with a short domain name, as then you can simply go `s4.nz?url=bob.com` to submit your scan.

### Setup Guide
1) Create a new Worker through wrangler or Cloudflare dashboard.
2) Once the worker has been created, navigate to Settings --> Variables.
3) Add an environment variable called 'API_KEY' and ensure the value is encrypted. This API_KEY is obtained from urlscan.io.
4) Copy and deploy the script in script.js of this repo, to your Worker.

### Usage Guide
Once the script is deployed to the Worker route of your choice, you can make the following request in a browser (or send a link to Discord/Slack for embedded link preview) `https://worker_domain.com?url=url_you_want_scan.com`. Optionally, you can append `&private=true` to keep your scan results private.

### Notes
- This script is designed to be used with other projects. You can use it on its own, but if you leave it public in its current state, unknown users can use up all of your urlscan.io API allowance.
- Free tier of urlscan.io only has 50 private scans a day. If private visibility is a must have for your use case, ensure your urlscan.io is enforcing the scan visibility at account level to prevent fallback to public visibility.
