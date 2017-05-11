# SWAPI_LIB
Library/Wrapper for https://swapi.co

Getting Started:
	There are five categories of functions in this library, acoording to the API resources: People, Films, Starships, Vehicles, Species and Planets. Each category has 4 functions e.g. for Planets they are:
	-> getPlanet(id,callback)
	-> getMultiplePlanets([ids],callback)
	-> getAllPlanets(callback)
	-> getSchema(callback)
	
	Example of usage:
	    getMultiplePlanets([1,2,5],function(url, response){
			console.log(url+":::"+data);
		})
	Additionally there is a function `getResources(callback)` to provide information on all available resources within the API.
	
	Every function implemented in the SWAPI_LIB has a callback, which is a function that will be ran as soon as the function terminates the queries to the https://swapi.co website. The callback needs to have two parameters: the first is the general url which was requested to the SWAPI and the second is the response.
	
	
	    