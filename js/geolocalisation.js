/*
    Script JavaScript
    Permet de géolocaliser de lancer initContour(gelocalisationContour.js)
    Et de relancer si on entre une adresse et un code postal, ou si on veut reset
    Julien LESSART
    11/05/20
    Version 1.0
*/

$(document).ready(function() { // Pour charger le Jquery au chargement de la page

    // Déclarations des variables
    let urlrequest = "", // chaine de caractère, url de requete ajax pour comarquage
        adresse = "", // Adresse qui peut être entrer utilisé avec comarquage
        codePostal = "", // Code postal qui peut être entrer, utilisé avec comarquage
        latitude = "", // Float de latitude
        longitude = ""; // Float de longitude

    function maPosition(position) {
        // Permet de savoir la géolocalisation
        // Un paramètre la position

        latitude = position.coords.latitude; // Longitude et latitude
        longitude = position.coords.longitude;
        initContour(latitude, longitude); // Appel de la fonction iniContour dans geolocalisationContour.js
    }

    if (navigator.geolocation) {
        // Si on a trouvé une position
        survId = navigator.geolocation.getCurrentPosition(maPosition, erreurPosition);
    } else {
        // Sinon
        alert("Ce navigateur ne supporte pas la géolocalisation");
    }

    function erreurPosition(error) {
        // pour gerer les erreurs 
        var info = "Erreur lors de la géolocalisation : ";
        switch (error.code) { // Switch du code d'erreur
            case error.TIMEOUT:
                info += "Timeout !"; // Si le temps est écoulé
                break;
            case error.PERMISSION_DENIED:
                info += "Vous n’avez pas donné la permission"; // Si on a pas la permision 
                break;
            case error.POSITION_UNAVAILABLE:
                info += "La position n’a pu être déterminée"; // Si la position n'a pas était déterminée
                break;
            case error.UNKNOWN_ERROR:
                info += "Erreur inconnue"; // Si on a une erreur inconnu
                break;
        }
    }

    $("#BtnRechercher").on("click", function() {
        // Quand on clique sur le bouton Rechercher

        // On s'occupe de l'url
        adresse = $("#Adresse").val();
        codePostal = $("#CodePostal").val();
        urlrequest = "http://ou.comarquage.fr/api/v1/geocode?postal_code=" + codePostal.toString() + "&street_address=" + adresse.toString();


        // Test si on a une adresse et un code postal en mémoire
        if ((adresse != "") && (codePostal != "")) {
            // Remplacement de la carte
            $("#macarte").remove(); // On remove la carte
            $(".container .row div").prepend("<div id=" + "macarte" + "></div>"); // Pour regler le probléme de map grise

            // Requete ajax
            $.ajax({
                type: "GET",
                url: urlrequest,
                dataType: "jsonp",
                jsonp: "jsonp",
                success: onGetCommuneSuccess,
                error: onGetCommuneError
            });

            // Si succes
            function onGetCommuneSuccess(reponse, status) {

                // On change la valeur de la latitude et de la longitude
                latitude = reponse.data.latitude;
                longitude = reponse.data.longitude;
                initContour(latitude, longitude); // Puis on rappel initContour
            }

            // Si echéc
            function onGetCommuneError(status) {
                alert(JSON.stringify(status)); // On affiche l'erreur
            }
        }
    });

    $("#BtnReset").on("click", function() {
        // Quand on clique sur le bouton reset

        window.location.reload();
    });
});