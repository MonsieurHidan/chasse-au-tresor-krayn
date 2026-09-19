# Chasse au trésor - Cartons de Krayn

Site statique très simple, ouvert en écriture à tout le monde, pour lister au fur et à mesure :
- le numéro du carton ouvert
- ce qui a été trouvé dedans
- la valeur trouvée sur internet (avec un lien source optionnel)
- si c'est un stretch goal ou pas

Pas de backend à coder : les données sont stockées dans **Firebase Firestore** (gratuit) et
mises à jour en temps réel pour tous les visiteurs. Le site lui-même est juste du HTML/CSS/JS
statique, déployable sur **Vercel** en connectant le repo **GitHub**.

## 1. Créer le projet Firebase (5 min, gratuit)

1. Va sur https://console.firebase.google.com et crée un nouveau projet (nom libre, ex: `krayn-cartons`).
2. Dans le projet, va dans **Compilation > Firestore Database** > **Créer une base de données**.
   - Choisis un emplacement (ex: `eur3`).
   - Démarre en **mode production**.
3. Une fois créée, va dans l'onglet **Règles** de Firestore et colle le contenu du fichier
   [`firestore.rules`](firestore.rules) de ce repo, puis **Publier**.
   - Ces règles autorisent tout le monde à lire/écrire dans la collection `entries`, avec des
     vérifications basiques (types de champs, taille max). C'est volontairement ouvert pour que
     "tout le monde puisse écrire" comme demandé — garde en tête que ça reste modifiable/supprimable
     par n'importe qui.
4. Va dans **Paramètres du projet** (roue crantée) > onglet **Général** > section **Vos applications**.
   - Clique sur l'icône Web (`</>`), donne un nom (ex: `site`), pas besoin de Firebase Hosting.
   - Firebase t'affiche un objet `firebaseConfig` (apiKey, authDomain, projectId, etc.).
5. Ouvre [`firebase-config.js`](firebase-config.js) dans ce repo et remplace les valeurs
   `REPLACE_ME` par celles affichées par Firebase.

Ces clés sont publiques par nature (la sécurité vient des règles Firestore, pas de ces clés) :
c'est normal et sans risque de les committer dans le repo.

## 2. Pousser le code sur GitHub

Depuis ce dossier :

```bash
git init
git add .
git commit -m "Site chasse au tresor - cartons Krayn"
```

Puis crée un repo vide sur https://github.com/new (par exemple `chasse-au-tresor-krayn`), et :

```bash
git remote add origin https://github.com/<ton-compte>/<ton-repo>.git
git branch -M main
git push -u origin main
```

## 3. Déployer sur Vercel

1. Va sur https://vercel.com, connecte-toi (ou crée un compte) avec GitHub.
2. **Add New... > Project**, choisis le repo que tu viens de pousser.
3. Framework Preset : **Other** (site statique, aucune commande de build nécessaire).
4. Clique **Deploy**. Au bout de quelques secondes tu as une URL publique (`*.vercel.app`).

Chaque futur `git push` sur `main` redéploiera automatiquement le site.

## Utilisation

- N'importe qui ouvre le site, remplit le formulaire (numéro, contenu, valeur, lien source,
  case "stretch goal") et clique **Ajouter** : l'entrée apparaît en temps réel pour tout le monde.
- Chaque ligne a un bouton **Modifier** (pré-remplit le formulaire) et **Supprimer**.
- Le champ de recherche filtre par numéro, contenu, valeur ou pseudo.

## Limites volontaires (site "très simple")

- Pas d'authentification : n'importe qui peut modifier/supprimer n'importe quelle ligne.
- Pas de modération intégrée. Si ça devient un problème, la solution la plus simple est de
  resserrer `firestore.rules` (ex: interdire `delete`, ou ajouter un mot de passe partagé
  vérifié côté règles).
