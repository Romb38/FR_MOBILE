<p align="center">
    <img src=".readme/logo.png" alt="Logo">
</p>

<p align="center">
<img src="https://img.shields.io/github/actions/workflow/status/Romb38/FR_MOBILE/ci-publishing.yml" alt="Build status"/>
<img src="https://img.shields.io/github/last-commit/Romb38/FR_MOBILE" alt="Last commit date"/>
<img src="https://img.shields.io/github/issues/Romb38/FR_MOBILE" alt="Issues count"/>
</p>
<p align="center">
  <a href="https://www.gnu.org/licenses/gpl-3.0.html" style="color: #0366d6; text-decoration: none; font-weight: bold; font-size:10px">
    GNU General Public License v3.0
  </a>
</p>

<p align="center">
  <a href="https://github.com/Romb38/FR_MOBILE/releases/latest">
  <img src=".readme/release.png" style="max-width: 25%; height: auto;" alt="Release picture">
  </a>
</p>
<hr>
<br>


## 📌 Contexte

Cette application a été développée dans le cadre d’un projet de Master 2 - Génie Informatique, au sein de l’UE Développement Mobile. Son objectif est de proposer une plateforme intuitive et collaborative permettant aux utilisateurs d’échanger et d’organiser des discussions autour de différents sujets.


## 🚀 Fonctionnalités

- [x] Gestion des Topics : Création, partage et organisation des sujets de discussion
- [x] Création et édition de Posts : Rédaction, modification et suppresion de posts sur des topics
- [x] Partage Collaboratif : Accès en lecture et écriture sur les topics
- [x] Gestion des erreurs : redirections et messages d'erreurs

## 🌍 Traduction

L'application a été traduite dans les langues suivantes :

- **Français**  
  🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100%

- **Anglais**  
  🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100%


## 🔧 Installation

### a) Prérequis
- [Node.js](https://nodejs.org/en/download/) (>= 16) et npm
- Ionic CLI :
```bash
npm install -g @ionic/cli
```
- Capacitor pour la gestion des fonctionnalités natives 
```bash
npm install --save @capacitor/core @capacitor/cli
```

### b) Configuration du project
1. Clôner le dépôt
```
git clone https://github.com/.../FR_MOBILE.git
cd FR_MOBILE
```
2. Installer les dépendances
```bash
npm install
```
3. Configurer Firebase
   - Récupérez le fichier google-services.json depuis Firebase.
   - Placez-le dans le dossier android/app/.
   - Synchronisez les plugins Capacitor :
```bash
npx cap sync
```
4. Créer un fichier `src/environments/environments.ts` et y ajouter les variables d'environnement nécessaires. Vous pouvez vous inspirer du fichier `environment.sample.ts` fourni dans le même répertoire `environments`.


## 🛠️ Commandes utiles

### a) Développement

- Lancer l’application en mode développement
```sh
ionic serve
```

- Exécuter l’application sur un appareil ou un émulateur
```sh
ionic capacitor run android --device
```

- Synchroniser les dépendances Capacitor
```sh
npx cap sync
```

- Mettre à jour Capacitor
```sh
npx cap update
```

### b) Build & déploiement

- Générer un build de l’application mobile
```sh
ionic build
npx cap copy
```

- Ouvrir le projet Android dans Android Studio
```sh
npx cap open android
```

- Compiler et générer l’APK (depuis Android Studio)
```sh
npx cap open android
```
Ensuite dans Android Studio :
- Allez dans Build > Build Bundle(s) / APK(s) > Build APK(s)
- Attendez que la compilation se termine, puis récupérez le fichier .apk dans android/app/build/outputs/apk/debug/
- Pour une version de production, sélectionnez Build Signed Bundle / APK, configurez votre clé de signature, puis générez l'APK.

Autrement, récupérez le fichier .apk généré par la CI pipeline.

### c) Configuration du formatage et vérification de code dans votre IDE

#### VSCode
1. Installez les extensions suivantes :
   - Prettier: VSCode Prettier Extension
   - ESLint: VSCode ESLint Extension
2. Ajoutez les paramètres suivants à votre fichier settings.json :
```json
{
  "editor.formatOnSave": true,
  "eslint.autoFixOnSave": true,
  "eslint.alwaysShowStatus": true,
  "eslint.validate": [
    "javascript",
    "typescript"
  ],
  "prettier.requireConfig": true
}
```

#### WebStorm
1. Allez dans **File > Settings > Editor > Code Style > JavaScript**
2. Dans **Languages & Frameworks > JavaScript/TypeScript > Code Quality Tools**, activez **ESLint** avec le fichier de configuration pointé sur `.eslintrc.json`
3. Ensuite dans **Languages & Frameworks > JavaScript/TypeScript > Prettier**, activez **On code reformat** et **On save** pour formatter le code automatiquement le code avec le fichier de configuration Prettier `.prettierrc`


## 👥 Contributeurs

<p align="center">
    <img src="https://github.com/Romb38.png" width="50" height="50" alt="Romb38" />
    &nbsp&nbsp&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/florent-dev.png" width="50" height="50" alt="florent-dev" />
    <br />  <a href="https://github.com/Romb38"> @Romb38 </a>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="https://github.com/florent-dev"> @florent-dev </a>
</p>
