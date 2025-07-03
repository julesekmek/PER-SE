# Armement App

Application web de gestion d'armement développée avec Next.js, TypeScript et TailwindCSS.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Page de connexion avec email et mot de passe
- Authentification basée sur un fichier JSON (`users.json`)
- Redirection automatique selon le rôle de l'utilisateur
- Gestion des sessions avec localStorage

### 👤 Gestion des Rôles
- **Administrateur** : Accès complet à toutes les fonctionnalités
- **Utilisateur** : Accès limité au catalogue et au compte
- Navigation dynamique selon le rôle
- Protection des routes par rôle

### 📦 Catalogue d'Armement
- Liste des articles avec images, types et stock
- Pages de détail pour chaque article
- Gestion complète du stock
- Interface responsive et accessible

### 🛠️ Back Office (Admin uniquement)
- **Gestion des utilisateurs** : CRUD complet
- **Gestion du catalogue** : Ajout, modification, suppression d'articles
- Interface d'administration intuitive

## 🛠️ Technologies Utilisées

- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **TailwindCSS** pour le styling
- **Design System français** pour l'interface
- **Fichiers JSON** pour la persistance des données

## 📁 Structure du Projet

```
src/
├── app/
│   ├── data/           # Fichiers de données JSON
│   ├── login/          # Page de connexion
│   ├── catalogue/      # Pages du catalogue
│   ├── compte/         # Page de compte utilisateur
│   └── admin/          # Pages d'administration
├── components/         # Composants réutilisables
├── contexts/          # Contextes React (Auth)
├── lib/               # Utilitaires et fonctions
└── types/             # Types TypeScript
```

## 🚀 Installation et Démarrage

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd armement-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir l'application**
   ```
   http://localhost:3000
   ```

## 👥 Comptes de Test

### Administrateur
- **Email** : `admin@armement.fr`
- **Mot de passe** : `admin123`
- **Accès** : Toutes les fonctionnalités

### Utilisateur Standard
- **Email** : `user@armement.fr`
- **Mot de passe** : `user123`
- **Accès** : Catalogue et compte uniquement

## 📋 Fonctionnalités Détaillées

### 🔐 Authentification
- Validation des identifiants
- Messages d'erreur explicites
- Redirection automatique selon le rôle
- Persistance de session

### 📦 Catalogue
- Affichage en grille responsive
- Filtrage par type d'arme
- Indicateurs de stock colorés
- Pages de détail complètes

### 🛠️ Administration
- **Utilisateurs** :
  - Liste de tous les utilisateurs
  - Ajout de nouveaux utilisateurs
  - Modification des informations
  - Suppression d'utilisateurs
  - Gestion des mots de passe

- **Catalogue** :
  - Gestion complète des articles
  - Modification du stock
  - Ajout/suppression d'articles
  - Validation des données

### 🎨 Design et UX
- Interface inspirée du Design System français
- Couleurs sobres et professionnelles
- Typographie claire et lisible
- Responsive design (mobile-friendly)
- Accessibilité optimisée

## 🔒 Sécurité

- Protection des routes par authentification
- Validation des rôles utilisateur
- Sanitisation des données d'entrée
- Gestion sécurisée des sessions

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les écrans :
- **Mobile** : Navigation hamburger, grille adaptée
- **Tablet** : Layout intermédiaire optimisé
- **Desktop** : Interface complète avec sidebar

## 🎯 Accessibilité

- Contraste texte/fond conforme aux standards
- Navigation au clavier
- Messages d'erreur clairs
- Structure sémantique HTML
- Labels explicites pour les formulaires

## 🔧 Configuration

### Variables d'Environnement
Aucune variable d'environnement requise pour le moment.

### Personnalisation
- Modifier les couleurs dans `tailwind.config.ts`
- Ajouter des utilisateurs dans `src/app/data/users.json`
- Modifier les articles dans `src/app/data/articles.json`

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
vercel --prod
```

### Autres Plateformes
```bash
npm run build
npm start
```

## 📝 Scripts Disponibles

- `npm run dev` : Démarrage en mode développement
- `npm run build` : Build de production
- `npm run start` : Démarrage en mode production
- `npm run lint` : Vérification du code avec ESLint

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Consulter les issues existantes
3. Créer une nouvelle issue avec les détails du problème

---

**Développé avec ❤️ en utilisant Next.js et le Design System français**
