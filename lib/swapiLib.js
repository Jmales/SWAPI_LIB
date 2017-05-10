//This will be our library
var swapiLib = function(){
    var baseURL = "http://swapi.co/api/";

    /*TODO: comment and do try/catch*/
    function httpRequestAsync(url, callback){ 
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(url,xmlHttp.responseText);
        }
        xmlHttp.open("GET", url, true); // true for asynchronous 
        xmlHttp.send(null);
    }

    /** Make a single request via HTTP, dependent on the provided 'path'*/
    function request(path) {
        return function() {
            //Arguments length for this function shall be:
            // -> 1 if only the 'callback' function is given
            // -> 2 if both the 'id' and 'callback' function are given
            var callback = null,
                id = null,
                newID = "";
            if(arguments.length === 1){
                callback=arguments[0];
            }
            else if(arguments.length === 2){
                id = arguments[0];
                callback = arguments[1];
                newID = "/" + id + "/";
            }
            else{ //Throw error. TODO: see again
                throw "Function shall have at least one argument 'callback' function"+
                     +"and at maximum two: 'id' followed by 'callback' function";
                return;
            }

            httpRequestAsync(baseURL + path + newID, callback);
        };
    }

    /**Receives array of ids to request via Http and waits for each of the requests to be finalyzed in order to return
    One good thing to do to this function is to make one general callback, which is done with
    Probably a new function replacing "httpRequestAsync" will be necessary */
    //TODO: maybe pass to request
    function requestMultiple(path) {
        var obj = {};
        return function(ids,callback){
            var httpCalls = ids.length;
            for(var i=0; i<ids.length; i++){
                httpRequestAsync(baseURL + path + "/"+ ids[i] + "/", function(url, response){
                    obj[url]=response;

                    --httpCalls;
                    if(httpCalls <=0){//Calls to http have terminated
                        callback(baseURL+path,obj);
                    }
                });

                
            }
        }
    }

   return{
       getResources: request(""),

       getPerson: request("people"),
       getMultiplePeople: requestMultiple("people"),
       getAllPeople: request("people"),
       getPeopleSchema: request("people/schema"),

       getFilm: request("films"),
       getAllFilms: request("films"),
       getFilmsSchema: request("films/schema"),

       getStarship: request("starships"),
       getAllStarships: request("starships"),
       getStarshipSchema: request("starships/schema"),

       getVechicle: request("vehicles"),
       getAllVechicles: request("vehicles"),
       getVechiclesSchema: request("vehicles/schema"),

       getSpecies: request("species"),
       getAllSpecies: request("species"),
       getSpeciesSchema: request("species/schema"),

       getPlanet: request("planets"),
       getAllPlanets: request("planets"),
       getPlanetsSchema: request("planets/schema"),

   }
}();