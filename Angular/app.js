
var myApp = angular.module("myApp", ['ui.bootstrap','ngAnimate','ngSanitize']); //"ui.bootstrap","ngRoute","ngAnimate"
myApp.config(['$httpProvider',function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

myApp.controller("mainCtrl", function ($scope,$http) {

    $scope.phrase = "";
    var types = {
        "normal": 1,
        "fighting": 2,
        "flying" : 3,
        "poison" : 4,
        "ground" : 5,
        "rock" : 6,
        "bug" : 7,
        "ghost" : 8,
        "steel" : 9,
        "fire" : 10,
        "water" : 11,
        "grass" : 12,
        "electric" : 13,
        "psychic" : 14,
        "ice" : 15,
        "dragon" : 16,
        "dark" : 17,
        "fairy" : 18
    };
    $scope.pokemon = {};
    $scope.pokelist = [];
    var pokeAPI = "https://pokeapi.co/api/v2/";
    $scope.toggle = true;

    $scope.enablePoster = function () {
        $scope.toggle = true;
    };

    $scope.search = function () {           // This function parses the search query and handles the further functionlity. It is triggered whenever the "Let's Catch Some Pokemon!" button is clicked.
        $scope.toggle = false;
        $scope.pokelist = [];
        $scope.phrase = $scope.phrase.toLowerCase();
        if (isNaN($scope.phrase) && types[$scope.phrase] != undefined) {        //Type based search since the search-query is one of the keys in types JS obj (Hash-map)

            console.log("Its a type ", types[$scope.phrase]);

            $http({                                 //Call  PokeApi/type
                method: "GET",
                url: pokeAPI + 'type/' + types[$scope.phrase],
                headers: {'Content-Type': 'application/json'}

            }).then(function (response) {

                $scope.pokelist = [];
                var pok_url = [];
                for (i = 0; i < response.data.pokemon.length; i++) {
                    pok_url = response.data.pokemon[i].pokemon.url.split('/');
                    console.log("The url is",pok_url);
                    var pok_id = pok_url[pok_url.length - 2];
                    var pok_id_num = parseInt(pok_id);       ///Extract pokemon ID through URL
                    if (pok_id_num <= 151){             //Limit search to 1st Generation Pokemons (Base Requirement of App)
                        explorePokemon(response.data.pokemon[i].pokemon.name);
                    }

                    console.log("I made API call");

                    console.log("The list of pokemons so far are: ",$scope.pokelist);
                }

            });
        }
        else if(isNaN($scope.phrase) === false) {
            console.log("Need to search based on ID");     //ID based search
            var ID = parseInt($scope.phrase);
            if (ID <= 151) {
                $scope.pokelist = [];
                // console.log("Its an ID or Name", $scope.phrase);
                var phrase = String(ID);
                explorePokemon(phrase);
            } else {
                handleError();
            }
        }
        else {                                          //Name based Search (Invalid entry being handled by explorePokemon function
            $scope.pokelist = [];
            console.log('Pokemon name based search');
            explorePokemon($scope.phrase);
        }




    };
    var handleHeight = function(ht){        //Calculates Height in appropriate metric for data received from an API call
        var ht_num = parseFloat(ht)/10;
        return ht_num +" meters";
    };

    var handleWeight = function(wt) {       //Calculates Weight in appropriate metric for data received from an API call
        var wt_num = parseFloat(wt)/10;
        return wt_num +" kg"
    };

    var handleError = function () {         //Interacts with user in case of error condition
        alert("Please enter valid Pokemon ID, Name or type. Only 1st generation pokemon can be explored. Enter any Pokemon ID less than 152");
        $scope.toggle = true;
    };

    var explorePokemon = function(phrase) {
        // return new Promise(function (resolve, reject) {
        var pokemon = {};
        var largeImgurl = "https://img.pokemondb.net/artwork/";
        $http({
            method: "GET",
            url: pokeAPI + 'pokemon/' + phrase,
            headers: {'Content-Type': 'application/json'}

        }).then(function (response) {

            var body = response.data;
            console.log(body);
            pokemon.name = body.name;
            pokemon.largeImg = largeImgurl + body.name +".jpg";
            pokemon.species = body.species;
            pokemon.height = handleHeight(body.height);
            pokemon.weight = handleWeight(body.weight);
            pokemon.types = body.types.slice();
            pokemon.moves =[];



            var move_count = 6;
            // $scope.pokemon.images = body.sprites;
            for(var i = 0; i<body.moves.length; i++){
                pokemon.moves.push(body.moves[i].move.name);
                if (i === move_count){
                    break;
                }
            }


            var urlSpeciesHabitat = body.species.url;        //make an API call to get habitat details and extract flavor-text(language:en) for species and for habitat as well
            $http({
                method: "GET",
                url: urlSpeciesHabitat,
                headers: {'Content-Type': 'application/json'}
            }).then(function (response){
                console.log(response.data.habitat.name);
                pokemon.habitat = response.data.habitat.name;
            });


            pokemon.sprites = [];                               //create an array of thumbnail pictures to be displayed to user
            for (key in body.sprites){
                if(body.sprites[key] !== null){
                    pokemon.sprites.push(body.sprites[key]);
                }
            }

            var abilityName = "";


            pokemon.abilityEffects = [];
            pokemon.abilityFlavorTexts = [];

            for (var i = 0; i < body.abilities.length; i++) {      //iterate over each ability Pokemon has to extract further data through API call
                // console.log("the abilites are: ", body.abilities[i]);
                abilityName = body.abilities[i].ability.name;
                var effects = [];


                $http({
                    method: "GET",
                    url: body.abilities[i].ability.url,
                    headers: {'Content-Type': 'application/json'}

                }).then(function (response) {
                    // console.log('The ability response is: ', response.data.effect_entries);
                    effects = response.data.effect_entries.slice();
                    var texts = [];
                    var flavor_arr = response.data.flavor_text_entries.slice();

                    var obj = {};       //hashmap to avoid repeating texts

                    for (var j = 0; j < flavor_arr.length; j++) {
                        if (flavor_arr[j].language.name === "en") {
                            obj[flavor_arr[j].flavor_text] = true;

                        }
                    }
                    for (var key in obj) {
                        texts.push(key);
                    }

                    pokemon.abilityFlavorTexts.push(texts[0]);

                    pokemon.abilityEffects.push(effects[0]);



                    // pokemon.abilities.push(abilityObj);
                    // console.log("ABilities so far ", $scope.pokemon.abilities);

                })
            }
            console.log("The final pokemon is: ",pokemon);
            $scope.pokelist.push(pokemon);
            console.log("the pokelist is ",$scope.pokelist);
            // return ($scope.pokemon);
        }, function(err){
            if(err.status === 404){
                handleError();
            }
        });

            console.log("I made API call");

    }
});