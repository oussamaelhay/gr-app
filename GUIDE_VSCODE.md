# 🏛️ Guide Complet — Application GRH (Gestion des Ressources Humaines)
## Ministère de l'Intérieur — Step-by-Step VSCode

---

## 📋 Aperçu du projet

| Fonctionnalité | Détail |
|---|---|
| **Authentification** | Login + Register avec localStorage |
| **Demande de Congé** | Formulaire → 2 PDFs (Demande + Bordereau DRH) |
| **Attestation de Travail** | Formulaire → 2 PDFs (Attestation + Bordereau DRH) |
| **Stack** | React 18 + TypeScript + Tailwind CSS + Vite + jsPDF |

---

## 🗂️ Structure du projet

```
grh-app/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── index.ts          ← Tous les types TypeScript
    ├── hooks/
    │   └── useAuth.ts         ← Logique authentification
    ├── utils/
    │   └── pdfGenerator.ts    ← Génération PDF (jsPDF)
    ├── components/
    │   └── Layout.tsx         ← Sidebar + navigation
    └── pages/
        ├── AuthPage.tsx       ← Login / Register
        ├── Dashboard.tsx      ← Tableau de bord
        ├── CongeForm.tsx      ← Formulaire congé
        └── AttestationForm.tsx ← Formulaire attestation
```

---

## 🚀 ÉTAPE 1 — Prérequis

Vérifier que Node.js est installé :

```bash
node --version   # Doit être ≥ 18
npm --version    # Doit être ≥ 9
```

Si Node.js n'est pas installé → https://nodejs.org/

---

## 📁 ÉTAPE 2 — Créer et ouvrir le projet dans VSCode

```bash
# Dans votre terminal, créer le dossier du projet
mkdir grh-app
cd grh-app

# Ouvrir dans VSCode
code .
```

---

## 📦 ÉTAPE 3 — Créer la structure de fichiers

Dans le terminal VSCode (Ctrl+` ou Terminal → New Terminal) :

```bash
# Créer les dossiers
mkdir -p src/components src/pages src/types src/utils src/hooks
```

---

## 📄 ÉTAPE 4 — Créer tous les fichiers

Copier les fichiers fournis dans ce guide dans les emplacements suivants :

### 4.1 — Fichiers de configuration (racine du projet)

| Fichier | Description |
|---|---|
| `package.json` | Dépendances npm |
| `vite.config.ts` | Configuration Vite |
| `tsconfig.json` | Configuration TypeScript |
| `tsconfig.node.json` | TypeScript pour Vite |
| `tailwind.config.js` | Configuration Tailwind CSS |
| `postcss.config.js` | Configuration PostCSS |
| `index.html` | Point d'entrée HTML |

### 4.2 — Fichiers source (`src/`)

| Fichier | Description |
|---|---|
| `src/main.tsx` | Point d'entrée React |
| `src/App.tsx` | Routage principal |
| `src/index.css` | Styles globaux + Tailwind |
| `src/types/index.ts` | Types TypeScript |
| `src/hooks/useAuth.ts` | Hook d'authentification |
| `src/utils/pdfGenerator.ts` | Génération des PDFs |
| `src/components/Layout.tsx` | Sidebar + navigation |
| `src/pages/AuthPage.tsx` | Page Login/Register |
| `src/pages/Dashboard.tsx` | Tableau de bord |
| `src/pages/CongeForm.tsx` | Formulaire congé |
| `src/pages/AttestationForm.tsx` | Formulaire attestation |

---

## ⚙️ ÉTAPE 5 — Installer les dépendances

```bash
npm install
```

Cette commande installe :
- `react` + `react-dom` — Framework UI
- `lucide-react` — Icônes (Printer, Calendar, FileText...)
- `jspdf` — Génération PDF côté client
- `jspdf-autotable` — Tables dans les PDFs
- `tailwindcss` + `autoprefixer` + `postcss` — CSS utilitaire
- `typescript` + `@vitejs/plugin-react` — Compilation

---

## 🖥️ ÉTAPE 6 — Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir dans le navigateur : **http://localhost:5173**

---

## 🔧 ÉTAPE 7 — Extensions VSCode recommandées

Installer ces extensions pour une meilleure expérience :

1. **ES7+ React/Redux/React-Native** (`dsznajder.es7-react-js-snippets`)
2. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
3. **TypeScript Importer** (`pmneo.tsimporter`)
4. **Prettier** (`esbenp.prettier-vscode`)
5. **Error Lens** (`usernamehw.errorlens`)

---

## 🔐 ÉTAPE 8 — Comprendre l'authentification

L'authentification utilise **localStorage** pour persister les données.

```typescript
// Dans useAuth.ts — comment ça marche :
// 1. register() → sauvegarde le nouvel utilisateur dans localStorage
// 2. login() → vérifie CIN + mot de passe, crée une session
// 3. logout() → supprime la session

// Données sauvegardées dans localStorage :
// - Clé "grh_users" → tableau de tous les utilisateurs
// - Clé "grh_session" → utilisateur connecté
```

**Première utilisation :** Créez un compte via "Inscription", puis connectez-vous.

---

## 📑 ÉTAPE 9 — Comprendre la génération PDF

La génération PDF est dans `src/utils/pdfGenerator.ts` avec **jsPDF**.

### Pour une Demande de Congé → 2 PDFs générés :

```typescript
generateDemandeConge(form)   // → Demande_Conge_NOM_Prenom.pdf
generateBordereauConge(form) // → Bordereau_Envoi_NOM_Prenom.pdf
```

### Pour une Attestation de Travail → 2 PDFs générés :

```typescript
generateAttestationTravail(form)    // → Attestation_Travail_NOM_Prenom.pdf
generateBordereauAttestation(form)  // → Bordereau_Attestation_NOM_Prenom.pdf
```

### Structure des PDFs (fidèles aux documents Ministère de l'Intérieur) :

```
┌─────────────────────────────────────┐
│  ROYAUME DU MAROC                   │
│  Ministère de l'Intérieur           │
│  Direction Générale des Affaires... │
├─────────────────────────────────────┤
│  DEMANDE DE CONGÉ / BORDEREAU       │
│  (Données de l'agent)               │
├─────────────────────────────────────┤
│  Cachet Admin | Avis Responsable    │
└─────────────────────────────────────┘
```

---

## 🎨 ÉTAPE 10 — Personnalisation

### Modifier les grades disponibles

Dans `src/pages/CongeForm.tsx` ou `AttestationForm.tsx` :

```typescript
// Ajouter un champ select pour le grade :
<select value={form.grade} onChange={set('grade')}>
  <option>Technicien 3ème Grade</option>
  <option>Technicien 2ème Grade</option>
  <option>Cadre Administratif</option>
  {/* ajouter vos grades ici */}
</select>
```

### Modifier l'en-tête des PDFs

Dans `src/utils/pdfGenerator.ts`, fonction `addHeader()` :

```typescript
doc.text('VOTRE MINISTÈRE', PAGE_W / 2, y, { align: 'center' });
// ↑ Modifier le texte selon votre organisation
```

### Changer les couleurs

Dans `src/index.css`, les couleurs utilisent Tailwind :
- **Amber** (`amber-600`) → couleur principale congé
- **Blue** (`blue-700`) → couleur principale attestation
- **Stone** → couleur de la sidebar

---

## 🏗️ ÉTAPE 11 — Build pour production

```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`.

Pour prévisualiser le build :

```bash
npm run preview
```

---

## ❗ Résolution de problèmes courants

### Erreur : `Cannot find module 'jspdf'`
```bash
npm install jspdf jspdf-autotable
```

### Erreur TypeScript `strict mode`
Vérifier que `tsconfig.json` a `"strict": true` et que tous les types sont définis.

### Les PDFs ne se téléchargent pas
Vérifier que le navigateur n'bloque pas les téléchargements automatiques multiples.
Chrome : cliquer sur l'icône de téléchargement en haut à droite et autoriser.

### Tailwind ne s'applique pas
Vérifier que `src/index.css` est importé dans `src/main.tsx` :
```typescript
import './index.css'
```

---

## 📊 Flux de l'application

```
Utilisateur non connecté
    ↓
AuthPage (Login / Register)
    ↓
[Authentification réussie]
    ↓
Layout + Sidebar
    ↓
┌─────────────────────────────────────┐
│          Dashboard                  │
│  ┌──────────────┐ ┌──────────────┐  │
│  │ Demande      │ │ Attestation  │  │
│  │ de Congé     │ │ de Travail   │  │
│  └──────────────┘ └──────────────┘  │
└─────────────────────────────────────┘
    ↓                      ↓
CongeForm              AttestationForm
    ↓                      ↓
[Formulaire validé]    [Formulaire validé]
    ↓                      ↓
PDF 1: Demande         PDF 1: Attestation
PDF 2: Bordereau DRH   PDF 2: Bordereau DRH
```

---

## 📌 Commandes de référence rapide

```bash
npm run dev      # Démarrer en développement → localhost:5173
npm run build    # Compiler pour production → dossier dist/
npm run preview  # Prévisualiser le build
```

---

*Application GRH — Ministère de l'Intérieur, Direction de la Sécurité et de la Documentation*
