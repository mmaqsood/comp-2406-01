/***
*		Mujahid Maqsood
*		ID: 100939220
*
*		Front end javascript
*		
*		Handles loading and rendering data from the server
*/

// Our API root that we talk to
var API_ROOT = 'http://localhost:2406';

/***
*		Loading & populating the user list, and attaching events to our
*		page
*/
window.onload = function() {
	// Load & Populate the hero list
	loadHeroes(populateHeroList);
	// Attach event listener
	var $viewButton = document.getElementById('view');
	$viewButton.onclick = onViewClick;
};

/***
*		Triggered when the view button is clicked
*		
*		Loads the selected hero from the server and populates its info
*/
var onViewClick = function () {
	// Get selected hero name
	var $select = document.getElementById('hero-list');
	var selectedHero = $select.item($select.selectedIndex);
	// Load from server and populate
	loadHero(selectedHero.value, populateHeroData);
}
/***
*		Takes a JSON array of heroes, iterates over them and adds options to
*		the hero list
*/
var populateHeroList = function (heroes) {
	var $select = document.getElementById('hero-list');
	for (var idx = 0; idx < heroes.length; idx++) {
		var hero = heroes[idx];
		var $option = document.createElement('option');
		// Options are set value/text to the file name / name
		// i.e Wonder_Woman/Wonder Woman
		$option.value = hero.fileNameSyntax;
		$option.text = hero.name;
		$select.add($option);
	}
}
/***
*		Takes a JSON object of a hero and then populates the DOM with the hero's
*		information, and adds the hero's styling.
*/
var populateHeroData = function (hero) {
	var $name = document.getElementById('name');
	var $alterEgo = document.getElementById('alter-ego');
	var $jurisdiction = document.getElementById('jurisdiction');
	var $superPowers = document.getElementById('super-powers');
	$name.value = hero.name;
	$alterEgo.value = hero.alterEgo;
	$jurisdiction.value = hero.jurisdiction;
	// Superpowers are an array so they need to be formatted
	// We simply turn the array into a string with each element separated
	// by a new line character
	var superPowers = (hero.superpowers || []).join('\n');
	$superPowers.value = superPowers;
	// Apply this hero's styles to the elements
	applyHeroStyles(hero.style);

}
/***
*		Iterates over a hero's style. The style object contains style attributes and
*		their values in a key/value format, and we iterate over this format to build the styling
*	
*		i.e
*		{
*			background-color: 'red'
*		} 
*/
function applyHeroStyles(heroStyle) {
	var $heroDetails = document.getElementById('hero-details');
	// Iterate over the keys to build our style
	var styleAttributes = Object.keys(heroStyle);
	for (var idx = 0; idx < styleAttributes.length; idx++) {
		var attributeName = styleAttributes[idx];
		var attributeValue = heroStyle[attributeName];
		// Set style
		$heroDetails.style[attributeName] = attributeValue;
	}
}
/***
*		AJAX
*/

/***
*		Sends a request to the server to fetch a single hero, and callbacks with the result
*		i.e http://localhost:2406/hero?name=Wonder_Woman
*/
var loadHero = function (name, callback) {
	sendRequest('/hero?name=' + name, callback);
}
/***
*		Sends a request to the server to fetch all heroes, and callbacks with the result
*		i.e http://localhost:2406/allHeroes
*/
var loadHeroes = function (callback) {
	sendRequest('/allHeroes', callback);
}
/***
*		Sends an XMLHttpRequest to the server for a given url to fetch that response
*		
*		It assumes that the response will be a JSON string and will attempt to parse it
*/
var sendRequest = function (url, callback) {
	var xhttp = new XMLHttpRequest();
	// Setup an asynchronous callback so we can do other things while we wait
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	// Response is here, lets json parse it and send it to teh callback
	    	callback(JSONify(this.responseText));
	    }
	};
	xhttp.open('GET', API_ROOT + url, true);
	xhttp.send();
}
/***
*		Takes a string and parses it is something, else returns an empty JSON object
*/
var JSONify = function (string) {
	if (string && string.length > 0) {
		return JSON.parse(string);
	}
	return {};
}