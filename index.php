<?php
/*
 * Jeu de morpion en javascript
 * 
 *
 * 
 */
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Morpion</title>
        <link href="css/morpion.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
        <header>
            <div class="joueur J1 actif">
                <input id="J1" value="Joueur 1" />
            </div>
            <div class="joueur J2">
                <input id="J2" value="Ordinateur" readonly />
            </div>
        </header>
        <table>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>            
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>        
        </table>
        <div class="resultat"></div>
        <button class="new" onclick="nouvelle()">Nouvelle partie</button>
        <script src="js/jquery.js" type="text/javascript"></script>
        <script src="js/morpion.js" type="text/javascript"></script>
    </body>
</html>
