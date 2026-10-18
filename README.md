# Lowly

Lowly est un site web statique pour publier des actualites, projets et carnets de bord. Le projet a ete simplifie pour fonctionner sans PHP, sans base de donnees et sans scripts tiers obligatoires.

## Arborescence

```text
lowly/
├── index.html
├── contact.html
├── newsletter.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       └── lowly-logo.jpg
├── vercel.json
└── README.md
```

## Installation et vérification

Depuis la racine du projet :

```bash
pnpm install
pnpm build
```

Le site est statique : `pnpm build` vérifie la syntaxe JavaScript et exécute les tests, sans générer de fichiers de sortie.

## Lancement local

```bash
pnpm dev
```

Le site est ensuite disponible sur `http://127.0.0.1:3000`. `pnpm start` lance le même serveur statique.

Pour tester l’environnement Vercel localement, utiliser directement `vercel dev`. L’option `--prod` n’est pas disponible sur cette commande : `vercel build --prod` crée un build local ciblant la production, tandis que `vercel --prod` déclenche un véritable déploiement.

## Deploiement

Le site peut etre deploye sur n'importe quel hebergement statique. Pour Vercel, importer le depot puis laisser Vercel servir les fichiers HTML a la racine. Le fichier `vercel.json` ajoute les redirections des anciennes URL et quelques en-tetes de securite.

## Notes techniques

- Aucune dependance Node ou PHP n'est requise.
- Les formulaires de contact et newsletter preparent un e-mail via `mailto:` afin de rester compatibles avec un hebergement statique.
- Les anciennes references au CMS historique, aux publicites et aux outils analytiques ont ete retirees.
- Les ressources locales sont servies depuis `assets/`.

## Ameliorations futures possibles

- Brancher un vrai service de formulaire ou de newsletter.
- Ajouter une page d'archives si le volume de publications augmente.
- Generer plusieurs tailles d'image pour optimiser encore le chargement.
- Ajouter une validation HTML/CSS automatisee dans un workflow CI.
