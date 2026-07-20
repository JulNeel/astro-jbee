# Lien d'évitement (skip link) — Conception

## Contexte

Le site utilise un layout unique ([src/layouts/Layout.astro](../../../src/layouts/Layout.astro)) :
`<body>` → `Header`/`HomeHeader` → `<div class="flex-1">` (contenu de la page via `<slot />`) → `Footer`.

Il n'existe aujourd'hui aucun moyen pour un·e utilisateur·rice au clavier ou d'un lecteur d'écran
de passer directement au contenu principal sans traverser le header (et son menu de navigation
sur chaque page). Il n'y a pas non plus de repère `<main>`.

## Objectif

Ajouter un lien d'évitement ("skip link") conforme au pattern WCAG "bypass block" :
- Invisible en usage normal (aucun impact visuel pour les autres utilisateurs).
- Visible et positionné en haut à gauche dès qu'il reçoit le focus clavier (première tabulation
  sur la page).
- Amène le focus directement sur le contenu principal de la page.

## Conception retenue

1. **Cible sémantique** : remplacer le `<div class="flex-1" style="contain: layout;">` (Layout.astro:84)
   par `<main id="main-content" class="flex-1" style="contain: layout;">`. Ceci ajoute un repère
   de navigation natif pour les lecteurs d'écran en plus de servir de cible au lien.
2. **Le lien** : ajouté comme tout premier enfant de `<body>`, avant le header :
   ```html
   <a href="#main-content" class="skip-link">Aller au contenu principal</a>
   ```
3. **Style** : classes Tailwind utilitaires — `sr-only` par défaut (hors écran), puis au focus
   (`focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50`) rendu visible avec un
   contraste fort en réutilisant les tokens de couleur existants du thème
   (`bg-secondary text-primary-contrast`, cohérent en light/dark via les CSS custom properties
   déjà définies dans `src/styles/global.css`).

## Hors périmètre

- Pas de lien secondaire vers le menu de navigation (un seul lien suffit vu la structure actuelle
  du site — header simple + `ResponsiveMenu`).
- Pas de changement du comportement du menu de navigation lui-même.

## Validation

- Vérification manuelle : première tabulation sur la page fait apparaître le lien ; l'activer
  déplace le focus clavier sur `<main>`.
- Vérification visuelle : le lien reste invisible sans interaction clavier, sur home et pages
  standards (Header vs HomeHeader).
