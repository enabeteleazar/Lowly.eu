<!DOCTYPE html>
<html lang="fr">

<head>
<?php include 'include/head.html'; ?>
</head>

<body class="html front not-logged-in no-sidebars page-node page-node- page-node-103065 node-type-home-page" >

<?php
// Tableau des fichiers à importer
$arrayPages = array(
 'home' => 'homepage.php',
 'newsletter' => 'newsletter.php',
 'contacts' => 'contacts.php'
);

// La variable $page existe-elle dans l'url ?
if(!empty($_GET['page']))
{
 // Vérification de la valeur passée dans l'url : est-elle une clé du tableau ?
 if(array_key_exists(strtolower($_GET['page']), $arrayPages))
 {
  // Oui, alors on l'importe
  include('pages/'. $arrayPages[ strtolower($_GET['page']) ] );
 }
 else
 {
  // Non, alors on importe un fichier par défaut
  include('pages/erreur-404.php');
 }
}
else
{
 // Non, on affiche la page d'accueil par défaut
 include('pages/'. $arrayPages['home']);
}
?>

<?php include 'include/footer.html'; ?>

</body>
</html>
