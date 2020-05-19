/*
    Script JavaScript
    Permet de prendre coordonnées des frontieres d'un département grâce à une API
    Julien LESSART
    11/05/20
    Version 1.0
*/

function initContour(latitude, longitude) {
    // Permet de trouver les coordonées des frontières
    // D'un département grâce à un jeu de données
    // Deux paramètres, latitude, longitude

    // Déclarations des variables
    let verif = 0; // Verif booléen pour savoir si polygone ou multiPolygone

    // Résultat de la concaténation de l'url
    let urlrequest = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=contours-geographiques-des-departements-2019&q=&facet=nom_dep0&facet=insee_dep&facet=insee_reg&facet=nom_reg&facet=region0&facet=nom_dep&geofilter.distance=";
    let urlrequestRes = latitude + "2%2C%2B" + longitude;
    urlrequest += urlrequestRes;


    // Requete Ajax
    $.ajax({
        type: "GET",
        url: urlrequest,
        success: onGetCommuneSuccess,
        error: onGetCommuneError
    });

    // Si succes
    function onGetCommuneSuccess(reponse, status) {
        let polygone = "" // On prend la valeur des coordonnées du départements
        if (reponse.records[0].fields.geo_shape.type === "MultiPolygon") {
            polygone = reponse.records[0].fields.geo_shape.coordinates[1]; // On prend la valeur des coordonnées du départements
            verif = 1;
        } else {
            polygone = reponse.records[0].fields.geo_shape.coordinates[0]; // On prend la valeur des coordonnées du départements
            verif = 0;
        }

        initMap(latitude, longitude, polygone, verif); // Puis on appel initMap pour créer la carte
    }

    // Si echec
    function onGetCommuneError(status) {
        alert(JSON.stringify(status)); // On affiche l'echec
    }

}