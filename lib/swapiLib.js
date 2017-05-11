/**This will be our library, 'swapiLib'. 
   The parens at the end cause the anonymous function to execute and return (Module Pattern: https://yuiblog.com/blog/2007/06/12/module-pattern/)*/
var swapiLib = function () {
    var baseURL = "http://swapi.co/api/";

    /**Make asynchronous request via HTTP.
     * A callback function needs to be provided in order to execute when finished.
     */
    function httpRequestAsync(url, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                callback(url, xmlHttp.responseText);
            if (xmlHttp.status === 404)
                throw new Error(url + ' replied 404:' + xmlHttp.statusText);
        }
        xmlHttp.open("GET", url, true); // true for asynchronous 
        xmlHttp.send(null);
    }

    /** Make request (single and multiple) via HTTP, dependent on the provided 'path'*/
    function request(path) {
        return function () {
            //Arguments length for this function shall be:
            // -> 1 if only the 'callback' function is given
            // -> 2 if both the 'id' array and 'callback' function are given
            var callback = null,
                ids = null,
                newIDs = [],
                obj = {};
            if (arguments.length === 1) {
                callback = arguments[0];
                newIDs.push("");
            }
            else if (arguments.length === 2) {
                ids = arguments[0];
                callback = arguments[1];

                if (ids.length === undefined) { //If only one query is necessary, do not perform the for loop
                    newIDs.push("/" + ids + "/");
                }
                else {
                    for (var i = 0; i < ids.length; i++) {
                        newIDs.push("/" + ids[i] + "/");
                    }
                }
            }
            else { //Return error.
                var errorMsg = 0;
                if (arguments.length !== undefined) {
                    errorMsg = arguments.length;
                }
                errorMsg += " arguments were provided: function shall have at least one argument, 'callback' function,\
                      and at maximum two: 'id' array followed by 'callback' function.";
                return [false, errorMsg];
            }

            //Receives array of ids to request via Http and waits for each of the requests to be finalyzed in order to return.
            //(Wait is not necessary, I just made it because I think that it makes more sense to receive an object with all the queries
            //instead of receiving multiple single objects, each with one query)
            var httpCalls = newIDs.length;
            for (var i = 0; i < newIDs.length; i++) {
                httpRequestAsync(baseURL + path + newIDs[i], function (url, response) {
                    obj[url] = response;

                    --httpCalls;
                    if (httpCalls <= 0) {//Calls to http have terminated
                        callback(baseURL + path, obj);
                    }
                });
            }
        };
    }


    return {
        getResources:                      request(""),

        Person:{
            getPerson:                   request("people"),
            getMultiplePeople:           request("people"),
            getAllPeople:                request("people"),
            getPeopleSchema:      request("people/schema"),
        },

        Film:{
            getFilm:                      request("films"),
            getMultipleFilms:             request("films"),
            getAllFilms:                  request("films"),
            getFilmsSchema:        request("films/schema"),
        },

        Starship:{
            getStarship:              request("starships"),
            getMultipleStarships:     request("starships"),
            getAllStarships:          request("starships"),
            getStarshipSchema: request("starships/schema"),
        },

        Vehicle:{
            getVehicle:                request("vehicles"),
            getMultipleVehicles:       request("vehicles"),
            getAllVehicles:            request("vehicles"),
            getVehiclesSchema:  request("vehicles/schema"),
        },

        Species:{
            getSpecies:                 request("species"),
            getMultipleSpecies:         request("species"),
            getAllSpecies:              request("species"),
            getSpeciesSchema:    request("species/schema"),
        },

        Planet:{
            getPlanet:                  request("planets"),
            getMultiplePlanets:         request("planets"),
            getAllPlanets:              request("planets"),
            getPlanetsSchema:    request("planets/schema"),
        }
    }
}();