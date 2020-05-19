/*
    Script JavaScript
    Permet de créer une map Leaflet
    Julien LESSART
    11/05/20
    Version 1.0
*/

function initMap(latitude, longitude, polygone, verif) {
    /* Créer l'objet "map" et l'insèrer dans l'élément HTML qui a l'ID "map" 
    4 paramètres :  latitude : la latitude en gon
                    longitude : la longitude en gon
                    polygone : contours du département localisé, array de valeur réels
                    verif : pour la verification si le polygone est un polygone simple ou un multi
    */

    // Déclarations des variables
    let p1 = L.latLng(latitude - 4, longitude - 1), // Sud ouest des bounds bas à droite max
        p2 = L.latLng(latitude + 4, longitude - 1), // Nord Est des bounds haut à gauche max
        bounds = L.latLngBounds(p1, p2), // On ajoute les bounds en format latLng
        carte = L.map('macarte', { // La carte
            maxBounds: bounds, // Le déplacement max
            dragging: L.Browser.mobile, // Pour rendre la map "touchable" 
            minZoom: 6, // Le zoom min (dézoom)
            maxZoom: 8 // Le zoom max (zoomer)
        }).setView([latitude, longitude], 6), // On met la vue sur la position de l'utilisateur avec un zoom de 6
        dataPolygon = [], // Pour récuperer les données du polygon extrait dans geolocalisationContour.js
        influence = L.circle([latitude, longitude], 100000, { // Pour le cercle de 100km autour du marker
            'color': '#FF7F00', // Couleur du cercle
            'fill': false, // Non remplit
        }).addTo(carte); // On l'ajoute a la carte

    // Pour le layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(carte); // On l'ajoute a la carte


    // Pour créer le contour du département

    // Si multiPolygone
    if (verif === 1) {
        for (let i = 0; i < polygone[0].length; i++) { // [0] Pour avoir le nombre d'index
            polygone.forEach(function(item) { // On boucle sur chaque tableau lat lng
                dataPolygon.push(L.latLng(item[i][1], item[i][0])); // On les ajoute au format latLng
            });
        }
    } else { // Sinon polygone simple
        polygone.forEach(function(item) {
            dataPolygon.push(L.latLng(item[1], item[0]));
        });
    }
    // On créer le polygon et on l'ajoute a la carte
    L.polygon(dataPolygon, { color: 'red' }).addTo(carte);

    // Pour le marqueur
    L.marker([latitude, longitude]).addTo(carte) // Pour le marqueur
        .bindPopup("[" + latitude + "] [" + longitude + "]") // Il écrit dans un popup les coordonnées
        .openPopup(); // Puis il ouvre le popup
}