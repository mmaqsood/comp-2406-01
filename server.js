/***
*		Mujahid Maqsood
*		ID: 100939220
*
*		Server 
*		
*		Serves an API for the user to serve static pages defined in the root directory of the 
*		application as well as an API that exposes the heroes JSON files defined in the heroes
*		directory. 
*/
var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime-types');
var heroHelpers = require('./hero-helpers.js');

/***
*		Basic router, every request is captured by this router and is then routed to other
*		routers depending on the URL
*/
function router(req, res) {
	if (req.url !== '/') {
		// URL module helps us focus on specific parts of the url, like the path in this case
		var parsedUrl = url.parse(req.url);
		var route = (parsedUrl) ? parsedUrl.pathname : '';
		switch (route) {
			case '/allHeroes':
			case '/hero':
				// All hero API requests go to the hero router
				heroRouter(parsedUrl, res);
			default:
				// Assume all other requests are requests for files
				fileRouter(parsedUrl, res);
		}
	}
	else {
		// There isn't really a path, so we'll serve the index html to be the default page
		var indexPage = fs.readFileSync('./index.html');
		// Setting code & content type for a good html page
		res.writeHead(200, {'content-type': 'text/html'});
		res.end(indexPage);
	}
};

/***
*		File router, handles serving html/css files from the root directory that exist with the 
*		name specified in the url parameter, if any.
*
*		If the name isn't found, a 404 page is displayed.
*/
function fileRouter(parsedUrl, res) {
	var code;
	var page;
	var isHtmlFile = parsedUrl.pathname.endsWith('.html');
	var isCSSFile = parsedUrl.pathname.endsWith('.css');
	var filePath = './' + parsedUrl.pathname;
	if (isCSSFile) {
		// CSS Files are located elsewhere
		filePath = './public/css/' + parsedUrl.pathname;
	}
	if ((isHtmlFile || isCSSFile) && fs.existsSync(filePath)) {
		// We found the page, read it and set the code
		code = 200;
		page = fs.readFileSync(filePath);
	}
	else {
		// We didn't find the requested page, so read the 404 page and set the code to 404
		// indicating that for the user
		code = 404;
		page = fs.readFileSync('./404.html');
	}
	// Setting content type & code appropriately and ending the request
	res.writeHead(code, {'content-type': mime.lookup(filePath) || 'text/html' });
	res.end(page);
}
/***
*		Hero router, handles serving JSON hero objects defined in the heroes directory
*
*		Serves all heroes and specific heros requested by name
*/
function heroRouter(parsedUrl, res) {
	var route = parsedUrl.pathname;
	var data = {};
	switch (route) {
		case '/allHeroes':
			// Retrieve all the heroes defined in the directory
			data = heroHelpers.getAll();
			break;
		case '/hero':
			// Since we're getting a query here, we have to do a bit of work to split the query
			// up and figure out what the requeusted name is
			var query = parsedUrl.query;
			// Our query will be in the format of name=something
			var splitQuery = (query) ? query.split('=') : [];
			// We validate the the query contains what we expect, since we don't want to be dealing
			// with malicious queries
			var hasNameParam = (splitQuery[0] && splitQuery[0] === 'name');
			// Ensuring that we actually have a value, and a query hasn't been sent without a value
			// i.e name=
			var hasValueParam = (splitQuery[1] && splitQuery[1].length > 0);
			if (splitQuery.length === 2 && hasNameParam && hasValueParam) {
				// Retrieve the specific hero
				data = heroHelpers.get(splitQuery[1]) || {};
			}
			break;
	}
	// Setting content type & code appropriately and ending the request
	res.writeHead(200, {'content-type': 'application/json' });
	// We have to stringify the JSON data to send it over as a string that the client will parse
	res.end(JSON.stringify(data));
}

// Start the server
var server = http.createServer(router);
server.listen(2406);
