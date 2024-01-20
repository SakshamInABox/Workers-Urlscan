export default {
  async fetch(request, env) {
    //Get parameters from request domain (i.e. domain.com?url=X&private=Z)
    const path = new URL(request.url);
    const url = path.searchParams.get('url')
    var visibility = 'public';
    if (path.searchParams.get('private') == 'true') {
      visibility = 'private'
    }

    const urlscan_host = "https://urlscan.io";
    const urlscan_endpoint = urlscan_host + "/api/v1/scan/";
    const body = {
      "visibility": visibility,
      "url": url
    };

    async function gatherResponse(response) {
      const { headers } = response;
      const contentType = headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return JSON.stringify(await response.json());
      } else 
        return response.text();
    }

    //urlscan.io POST body.
    const init = {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "API-Key": env.API_KEY,
        "content-type": "application/json",
      },
    };

    const response = await fetch(urlscan_endpoint, init);
    const results = await gatherResponse(response);
    const results_obj = JSON.parse(results);
    
    //Parse response from urlscan.io
    var message = results_obj.message;
    var submission_result = results_obj.result;
    var submission_visibility = results_obj.visibility;
    var submission_url = results_obj.url;
    var submission_country = results_obj.country;

    //Display results in HTML and headers to allow for link preview in Slack, Discord, etc.
    const description = "Your urlscan.io " + visibility + " scan is available at " + submission_result + ". Scan can take a few minutes to complete and may return a 404 error if scan is in progress.";
    const preview_url = submission_result
    var html = `<!DOCTYPE html>

    <head>
      <title>Your ${visibility} urlscan.io Result:</title>
      <meta charset="utf-8">
      <meta name="robots" content="noindex">
      <meta name="theme-color" content="#00aff4">
      <meta property="og:title" content="Your urlscan.io Result.">
      <meta property="og:url" content="${submission_result}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${preview_url}">
      <meta property="twitter:card" content="summary_large_image">
    </head>

    <body>
      <h1>Your urlscan.io Result:</h1>
      <p>Message: ${message}</p>
      <p>Submission Visibility: ${submission_visibility}</p>
      <p>Submission Country: ${submission_country}</p>
      <p>Submission Result: <a href=\"${submission_result}\">${submission_result}</a></p>
    </body>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
