/***
*		Mujahid Maqsood
*		ID: 100939220
*
*		Helper file that iterates over the heroes directories to retrieve all and specific heroes
*/
var fs = require('fs');
var BASE_PATH = './heroes';
module.exports = {
	// Iterate over all of the JSON files defined in the heroes directory and require each one,
	// creating an array of heroes that is then returned
	getAll: function () {
		var heroFiles = fs.readdirSync(BASE_PATH);
		var heroes = [];
		for (var idx = 0; idx < heroFiles.length; idx++) {
			var heroPath = heroFiles[idx];
			// We only want to grab .JSON files
			if (/\.json$/.test(heroPath)) {
				// Requiring the object and adding it to the array
				var heroObject = require(BASE_PATH + '/' + heroPath);
				heroes.push(heroObject);
			}
		}
		return heroes;
	},
	// Attempt to require a single hero file defined in the directory and return a specific hero
	// by name
	get: function (heroName) {
		var heroPath = BASE_PATH + '/' + heroName + '.json';
		if (fs.existsSync(heroPath)) {
			var heroObject = require(heroPath);
			return heroObject;
		}
	}
}