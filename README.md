# SWAPI_LIB
Library/Wrapper for https://swapi.co

Getting Started:

There are five categories of functions in this library, acoording to the API resources: People, Films, Starships, Vehicles, Species and Planets. Each category has 2 functions e.g. for Planets they are:

-> getPlanets(id): e.g. getPlanets(1), getPlanets([1,2,3]), getPlanets()
-> getPlanetsSchema()

The first function `getPlanets()` accepts three variations of inputs:
    -> 0 inputs: `getPlanets()` returns information on all the available Planets;
    -> 1 input: 
	- 1 id: `getPlanets(1)` returns information about the 1st Planet, if there is one
	- array of ids: `getPlanets([1,2,6])` returns information about the 1st, 2nd and 6th Planet, if they exist
If some Planet if queried and does not exist, the error "404 Not found" will still be appended to the returned object.

Additionally there is a function `getResources()` to provide information on all available resources within the API.

Every function implemented in the SWAPI_LIB deals with promises (https://developer.mozilla.org/pt-PT/docs/Web/JavaScript/Reference/Global_Objects/Promise).
	
Example of usage:

	swapiLib.Vehicles.getVehicles([1,2,3])
		.then(function (response) {
				//Do Stuff
			})
		.catch(function (error) {
				//Deal with error. E.g. having too many inputs to function
	});
	
NOTE: Tested in Firefox 53.0.2, Chrome 58.0.3029.110 and Opera 45.0.
	
	    
