/**This will be our library, 'swapiLib'. 
   The parens at the end cause the anonymous function to execute and return (Module Pattern: https://yuiblog.com/blog/2007/06/12/module-pattern/)
   Encapsulated in a self-anonymous function (Module Pattern: https://yuiblog.com/blog/2007/06/12/module-pattern/)*/
var swapiLib = function () {
    var baseURL = "http://swapi.co/api/";

    /**Make asynchronous request via HTTP, using Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
     * The function is recursive for when the element has a next page. This is done to extract all the Films, People, etc 
     * instead of individual pages.
     */
    function fetchPath(url) {
        return new Promise(function (resolve, reject) {
            var obj = {};
            function fetchUrl(url) {
                var url = url;
                fetch(url).then(function (response) {
                    if(response.status >= 200 && response.status < 300) return response.json();  
                    else return Promise.reject(Error(response.statusText || response.status));   //If some error occurs, handle it
                }).then(function (data) {
                    obj[url] = data;
                    //If there are more pages, fecth them. Recursive part.
                    if (data.next && data.next !== null) fetchUrl(data.next);
                    else resolve(obj);
                }).catch(function (e) {
                    reject(e);
                })
            }
            fetchUrl(url);
        })
    }

    /** Make request (single and multiple) via HTTP, dependent on the provided 'path'*/
    function request(path) {
        return function () {
            var argumentsObj = arguments;
            return new Promise(function (resolve, reject) {
                //Arguments length for this function shall be:
                // -> 0 if no ids are given
                // -> 1 if both the 'id' array (or value) is given
                var ids = null,
                    newIDs = [],
                    obj = [];
                if (argumentsObj.length === 0) {
                    newIDs.push("");
                }
                else if (argumentsObj.length === 1) {
                    ids = argumentsObj[0];

                    if (ids.length === undefined) { //If only one query is necessary, do not perform the for loop
                        newIDs.push("/" + ids + "/");
                    }
                    else {
                        for (var i = 0; i < ids.length; i++) {
                            newIDs.push("/" + ids[i] + "/");
                        }
                    }
                }
                else { //Return error via reject() with input parameters.
                    var errorMsg = 0;
                    if (argumentsObj.length !== undefined) {
                        errorMsg = argumentsObj.length;
                    }
                    errorMsg += " arguments were provided: function shall have at maximum one argument,'id' value/array.";
                    reject(errorMsg);
                }

                //Receives array of ids to request via Http and waits for each of the requests to be finalized in order to return.
                //(Wait is not necessary, I just made it because I think that it makes more sense to receive an object with all the queries
                //instead of receiving multiple single objects, each with one query)

                //TODO: make function in order to avoid common code in then and catch
                var httpCalls = newIDs.length;
                for (var i = 0; i < newIDs.length; i++) {
                    var commonStr = baseURL + path + newIDs[i];
                    fetchPath(commonStr)
                        .then(function (response) {
                            obj.push(response);
                             --httpCalls;
                             if (httpCalls <= 0){
                                resolve(obj);
                            }
                        })
                        .catch(function (error) {
                            var tmpObj = {};
                            tmpObj[commonStr] = error;
                            console.log(error.message);
                            obj.push(tmpObj);

                            --httpCalls;
                            if (httpCalls <= 0){
                                resolve(obj);
                            }
                            
                        });
                }
            });
        };
    }
    return {
        getResources: request(""),

        People: {
            getPeople: request("people"),
            getPeopleSchema: request("people/schema"),
        },

        Films: {
            getFilms: request("films"),
            getFilmsSchema: request("films/schema"),
        },

        Starships: {
            getStarships: request("starships"),
            getStarshipsSchema: request("starships/schema"),
        },

        Vehicles: {
            getVehicles: request("vehicles"),
            getVehiclesSchema: request("vehicles/schema"),
        },

        Species: {
            getSpecies: request("species"),
            getSpeciesSchema: request("species/schema"),
        },

        Planets: {
            getPlanets: request("planets"),
            getPlanetsSchema: request("planets/schema"),
        }
    }
}();