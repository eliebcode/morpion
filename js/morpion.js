/* 
 * Code pour le morpion
 * 
 */



// Modification du DOM


function activeJoueur(j) {
    // Rôle : marque le joueur comme actif
    // Retour : néant
    // Paramètre :
    //      j : 1 ou 2 (numéro du joueeur)
    
    // Mettre sur le joueur la classe "actif"
    $("header .joueur.J"+j).addClass("actif");
    
    
}

function desactiveJoueur(j) {
    // Rôle : marque le joueur comme non actif
    // Retour : néant
    // Paramètre :
    //      j : 1 ou 2 (numéro du joueeur)
    
    // Retirer la classe actif du joueur
    $("header .joueur.J"+j).removeClass("actif");
    
}

function marqueCase(lig, col, marque) {
    // Rôle : marque une case (jouée par J1 ou J2, ou libre)
    // Retour : néant
    // Paramètre :
    //      lig, col : position de la case
    //      marque : 1 pour J1, 2 pour J2, 0 pour libérer la case
    
    // Récupérer la case :
    var laCase = caseLG(lig,col);
    
    // Si marque = 0 : on doit s'assurer que le TD n'a ni la classe joueur1, ni joueur1
    // si marque = 1 ou 2 : on met la classe joueurX et on retire l'autre
    marqueCaseDirect(laCase, marque);
    
}

function marqueCaseDirect(elt, marque) {
    // Rôle : marque une case (jouée par J1 ou J2, ou libre)
    // Retour : néant
    // Paramètre :
    //      elt : élément du DOM correspondant à la case
    //      marque : 1 pour J1, 2 pour J2, 0 pour libérer la case    
    if (marque === 0) {
        $(elt).removeClass("joueur1 joueur2");
    } else if (marque === 1) {
        $(elt).removeClass("joueur2");
        $(elt).addClass("joueur1");
    } else if (marque === 2) {
        $(elt).removeClass("joueur1");
        $(elt).addClass("joueur2");
    }
    
}

function afficheFin() {
    // Rôle : aficher fin de partie (match nul)
    // Retour : néant
    // Paramètres : néant
    
    $(".resultat").html("Toutes les cases sont jouées, match nul");
    
}

function afficheGagnant(j) {
    // Rôle : aficher le gagnant
    // Retour : néant
    // Paramètres : 
    //      j : numéro du joeur qui a gagné
    
    $(".resultat").html("Bravo " + $("input#J"+j).val() + ", vous avez gagné ! " );
    
}

function effaceResultat() {
    // Rôle : effacer le résultat
    // Retour : néant
    // Paramètres : néant
    
    $(".resultat").html('');
}

// Récupération d'infos sur le DOM
function getJoueurActif() {
    // Rôle : retourner le numéro du joueur actif
    // Retour : 1 ou 2 (selon joueur actif)
    // Paramètres : néant
    
    // Méthode : si le joueur 1 à la classe actif : retourne 1
    //          sinon on retourne 2
    
    if ($("header .joueur.J1").hasClass("actif")) {
        return 1;
    } else {
        return 2;
    }
    
}

function etatCase(elt) {
    // Rôle : retourner l'état d'une case
    // Retour : 1 si jouée par J1, 2 si jouée par J2, 0 si libre
    // Paramètres :
    //      elt : elt du DOM représentant la case
    
    if ($(elt).hasClass("joueur1")) {
        return 1;
    } else if ($(elt).hasClass("joueur2")) {
        return 2;
    } else {
        return 0;
    }
    
}

function etatCaseByLG(lig, col) {
    // Rôle : retourner l'état d'une case
    // Retour : 1 si jouée par J1, 2 si jouée par J2, 0 si libre
    // Paramètres :
    //      lig, col : ligne et colonne de la case
    
    return etatCase(caseLG(lig,col));
}

function caseLG(lig,col) {
    // Rôle : retourner l'objet DOM correspondand à une case
    // Retour : objet du DOM
    // Paramètres :
    //      lig, col : ligne et colonne de la case (1 à 3)
    
    // si on a des id lig-col sir les cases : return $("#"+lig+"-"+col).get(0);  
    var eltLig = $("table tr").get(lig-1);      // On récupère l'élément du DOM correspondant au TR numéro lig
    var cell = $(eltLig).find("td").get(col-1); // La col-ième TD dans eltLig
    return cell;
    
    // ou : 
    return $("table tr:nth-child("+lig+") td::nth-child"+col+")").get(0);    
}


// Fonctions de traitement des évènements

function joue(elt) {
    // Rôle : on joue une case (le joueur actif va jouer la case si elle est libre)
    // Retour : néant
    // paramètres :
    //      elt : objet du DOM correspondant à la case
    
    // Récupérer qui est le joueur actif
    var joueur = getJoueurActif();
    
    // Tester la case que l'on veut jouer :
    // Si elle n'est pas libre, on ne fait rien
    // Si elle est libre :
    //  On la joue avec le joueur actif
    if (etatCase(elt) !== 0) {
        // La case n'est pas libre
        return;
    }
    
    // La case est libre : on la joue ave le numéro du joueur actif
    marqueCaseDirect(elt, joueur);
    

    if (detecteGagnant(joueur)) {
        // Vérifie si le joueur qui vient de jouer à gagner
        afficheGagnant(joueur);         // Félicite le gagnant
        return;
    }
    if (detecteBloque()) {
        // Vérifie si on peut encore jouer
        afficheFin();       // Affiche la situation de match nul
        return; 
     }
    
    // Changer de joueur
    // Désactive le joueur actif :
    desactiveJoueur(joueur);
    // Change de joueur :
    joueur = 3 - joueur;        // On peut le faire avec des if si on ne pense pas que 3 - 1 = 2, 3 - 2 = 1
    // Active le nouveau joueur actif
    activeJoueur(joueur);
    
    
    // Jouer automatiquement pour l'ordinateur
    auto();
}


function nouvelle() {
    // Rôle : initialiser une nouvelle partie
    // Retour : néantr
    // Paramètres : néant
    
    
    // Vider toutes les cases
    // Pour chaque ligne : lig de 1 à 3
    for (var lig = 1; lig <= 3; lig++) {
        //  Pour chaque colonne : col de 1 à 3
        for (var col = 1; col <= 3; col++) {       
            //  mettre la case à 0
            marqueCase(lig, col, 0);
        }
    }
    
    var lig = 1;
    
    // Effacer le message éventuel
    effaceResultat();
    
    // Donner la main à un joueur : on laisse le dernier joueur actif (mais on pourrait faire d'autres choix)
    // Rien à faire....
}


function detecteBloque() {
    // Rôle : détecter si on peut encore joueur
    // Retour : true si il n'y a pas de case libre, false sinon
    // Paramètres : néant
    
    
    // Pour chaque case (chaque ligne, et chaque colone de la ligne) :
    //      si la case est libre : return true
    for (var lig = 1; lig <= 3; lig++) {
        //  Pour chaque colonne : col de 1 à 3
        for (var col = 1; col <= 3; col++) {       
            //  si la case est libre : return false
            if (etatCaseByLG(lig,col) === 0) return;
        }
    }
    // Si on arrive là : aucune case n'est libre : return true
    return true;

    
}


function detecteGagnant(j) {
    // Rôle : détecter si j a gagné
    // Retour : true si il a gagné, false sinon
    // Paramètres : 
    //   j : numéro du joueur à tester (1 ou 2)
    
    
    // Vérifier si on a aligné sur une ligne :
    // cad : pour chaque ligne :
    //      si on les 3 case ( colonne) sont jouées par j, il a gagné (return true)
    for (var lig = 1; lig <= 3; lig++) {
        if (etatCaseByLG(lig,1) === j && etatCaseByLG(lig,2) === j && etatCaseByLG(lig,3) === j ) {
            return true;
        }
    }
    
    // Vérifier si on aligne une colonne :
    for (var col = 1; col <= 3; col++) {
        if (etatCaseByLG(1, col) === j && etatCaseByLG(2, col) === j && etatCaseByLG(3, col) === j ) {
            return true;
        }
    }
    // vérifier diagonale 1
    if (etatCaseByLG(1, 1) === j && etatCaseByLG(2, 2) === j && etatCaseByLG(3, 3) === j ) {
        return true;
    }
    // vérifier diagonale 2
    if (etatCaseByLG(1, 3) === j && etatCaseByLG(2, 2) === j && etatCaseByLG(3, 1) === j ) {
        return true;
    }    
    // Si on arrive ici, on n'a rien trouvé : return false
    return false;
    
}



// Fonctions pour faire jouer l'ordinateur

function auto() {
    // Rôle : choix et jeu automatique du meilleur coup
    // Retour : néant
    // Paramètres : néant
    
    
    // Récupération du joueur actif
    var joueur = getJoueurActif();
    // Choisir le meilleur coup
    elt = choixMeilleurCoup(joueur);        // Récupère la case à jouer pour le meileur coup
    
    // La case est choisie : on la joue ave le numéro du joueur actif
    marqueCaseDirect(elt, joueur);
    

    if (detecteGagnant(joueur)) {
        // Vérifie si le joueur qui vient de jouer à gagner
        afficheGagnant(joueur);         // Félicite le gagnant
        return;
    }
    if (detecteBloque()) {
        // Vérifie si on peut encore jouer
        afficheFin();       // Affiche la situation de match nul
        return; 
     }
    
    // Changer de joueur
    // Désactive le joueur actif :
    desactiveJoueur(joueur);
    // Change de joueur :
    joueur = 3 - joueur;        // On peut le faire avec des if si on ne pense pas que 3 - 1 = 2, 3 - 2 = 1
    // Active le nouveau joueur actif
    activeJoueur(joueur);
    
}


function choixMeilleurCoup(j) {
    // Rôle : rechercher la meilleure case à jouer pour le joueur J
    // Retour : objet DOM correspondant à la case à jouer
    // Paramètres :
    //      j : numéro du joueur
    
    
    // Version simplifiée : chercher la première case libre
    for (var lig = 1; lig <= 3; lig++) {
        //  Pour chaque colonne : col de 1 à 3
        for (var col = 1; col <= 3; col++) {       
            //  si la case est libre : return false
            if (etatCaseByLG(lig,col) === 0) return caseLG(lig, col);
        }
    }
    
    
    // Algorythme réel :
    /*
     *  - vérifier si on peut gagner :
     *       si il existe une ligne, une colonne ou une diagonale avec 2 cases à nous et une case libre : 
     *          jouer la case libre
     *  - verifier si on doit contrer : 
     *      si il existe une ligne, une colonne ou une diagonale avec 2 cases de l'adversaire et une case libre : 
     *          jouer la case libre
     *  - si la case centrale est libre : jouer la case centrale
     *  - chercher l'intersection de 2 nous appartenant : 
     *          - un des cases vides ou parmi la ligne, la colone et la diagonale (si elle existe)
     *                  2 ont une case à notre couleur et 2 cases vides
     *          - si on trouve, on joue (et on gagnera au tour suivant)
     *  - chercher une intersection ou il n'y a pas l'adversaire 
     *           - un des cases vides ou parmi la ligne, la colone et la diagonale (si elle existe)
     *                  pour 2, il n'y a que notre couleur ou des cases vides
     *          - si on trouve, on joue (et on gagnera au tour suivant)
     * - chercher une case qui nous permette d'aligner 2
     *           - un des cases vides sur la ligne, la colone ou la diagonale, on a déjà une case à nous et une case vide
     *          - si on trouve, on joue (et on gagnera au tour suivant)        
     * - jouer la 1ère case vide restante        
     */
    
}

function initialise() {

    
}



// Initialiation de la page
$(document).ready( initialise );     // Attention : le paramètrede ready est l'objet fonction (pas avec les parenthèses)
            // ready est une méthode qui déclare, enregistre un traitement à faire quand le docuent sera chargé
            // L'argument de la méthode est une fonction (callback)

$(document).ready( function() {           // Déclaration de fonction anonyme
    // Ici, le code de la fonction appelée quand l'èvnement ready se déclenche
    $("td").on("click", function() {
        // Dans cette fonction, this est l'élémet sur lequel l'évènement s'est déclenché
        // this désigne l'élément clicker (l'élément du DOM ayant subi l'évènemet
        joue(this);
    });
    
    
});

