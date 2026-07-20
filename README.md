# Contrôle Hercule × Chacal — RPI Menuiserie

Interface web qui confronte deux PDFs (commercial *Hercule* + fabrication *Chacal*) d'une même commande et déclenche le contrôle automatisé via un workflow n8n.
Application single-page React, design dark premium, déploiement Netlify en statique — le client appelle le webhook n8n directement.

---

## Stack

| Couche | Version installée |
|---|---|
| Node.js | 18+ (testé sur 24.12) |
| Vite | 8.0.8 |
| React | 19.2 |
| TypeScript | 6.0 (strict) |
| Tailwind CSS | 4.2 (via `@tailwindcss/vite`) |
| Motion (Framer Motion v12) | 12.38 |
| Lucide React | 1.8 |

---

## Architecture

```
┌─────────┐   multipart/form-data + X-RPI-Auth    ┌────────────┐
│ Browser │ ────────────────────────────────────> │   n8n      │
│  (SPA)  │         POST VITE_N8N_WEBHOOK_URL     │  webhook   │
│         │ <──────────────────────────────────── │            │
└─────────┘              JSON response            └──────┬─────┘
                                                         │
                                                         ▼
                                                   Gmail (email
                                                   au contrôleur)
```

- Le SPA appelle **directement** le webhook n8n — plus de proxy Edge Function.
- Le token d'auth est bundlé dans le JS client (`VITE_N8N_AUTH_TOKEN`). Ce n'est donc pas un secret : il sert uniquement à filtrer le bruit public et doit être vu comme une convention d'accès. Protège le workflow côté n8n par d'autres moyens si nécessaire (rate limit, IP allowlist, etc.).
- **CORS** : le workflow n8n doit autoriser l'origine du site Netlify (`Access-Control-Allow-Origin`) et accepter l'en-tête `X-RPI-Auth` (`Access-Control-Allow-Headers`). Sinon le browser bloque la requête.

---

## Prérequis

- Node.js ≥ 18
- npm (testé sur 11.6)
- Optionnel : [Netlify CLI](https://docs.netlify.com/cli/get-started/) pour le déploiement

---

## Configuration

```bash
git clone <repo-url>
cd rpi-controle-hercule-chacal
npm install
cp .env.example .env.local
```

Édite `.env.local` :

```
VITE_N8N_WEBHOOK_URL=https://n8n.rpimenuiserie.site/webhook/controle-hercule-chacal
VITE_N8N_AUTH_TOKEN=<ton-token-ici>
```

> `.env.local` est gitignoré. Les deux variables sont préfixées `VITE_` parce qu'elles doivent être embarquées dans le bundle client (le browser appelle n8n directement).

---

## Développement local

```bash
npm run dev
```

→ http://localhost:5173
L'app appelle directement le webhook n8n défini dans `.env.local`. Assure-toi que CORS est configuré côté n8n pour `http://localhost:5173`.

### URL de debug (dev uniquement)

En mode développement, `?state=idle|analyzing|result` force l'affichage d'un état donné (auto-désactivé en prod). Utile pour vérifier les transitions visuelles sans lancer de vrai contrôle.

---

## Build & preview

```bash
npm run build      # tsc -b && vite build → dist/
npm run preview    # sert dist/ pour validation manuelle
```

---

## Déploiement Netlify

### Premier déploiement

```bash
netlify login
netlify init
netlify deploy --prod
```

### Variables d'environnement à configurer

Dans le dashboard Netlify — **Site settings → Environment variables** :

| Clé | Valeur | Portée |
|---|---|---|
| `VITE_N8N_WEBHOOK_URL` | `https://n8n.rpimenuiserie.site/webhook/controle-hercule-chacal` | Builds |
| `VITE_N8N_AUTH_TOKEN` | `<ton-token>` | Builds |

Les deux variables sont embarquées dans le bundle client au build. Re-déclenche un deploy après toute modification :

```bash
netlify deploy --prod
```

### Déploiements suivants

```bash
netlify deploy --prod            # prod
netlify deploy                   # preview URL (recommandé pour QA)
```

---

## Troubleshooting

| Symptôme | Cause probable | Résolution |
|---|---|---|
| `Configuration manquante` au submit | Env vars pas chargées | Vérifier `.env.local` en dev, ou les env vars Netlify en prod (portée Builds), puis rebuild |
| Erreur CORS dans la console | n8n ne renvoie pas les bons en-têtes | Configurer `Access-Control-Allow-Origin` (origine Netlify + `http://localhost:5173`) et `Access-Control-Allow-Headers: X-RPI-Auth, Content-Type` côté n8n |
| Timeout 180 s côté client | Workflow trop long | Ajuster `REQUEST_TIMEOUT_MS` dans `src/lib/constants.ts` ou optimiser le workflow |
| 401/403 n8n | Mauvais token | Vérifier que `VITE_N8N_AUTH_TOKEN` correspond à ce que le workflow attend |
| "Les deux fichiers combinés dépassent 5 Mo" | Somme > `MAX_COMBINED_SIZE_MB` | Compresser les PDFs, ou ajuster la constante |

---

## Structure

```
src/
├── App.tsx                      # Orchestration 3 états (idle / analyzing / result)
├── main.tsx
├── index.css                    # Tailwind v4 + tokens @theme + utilities
├── components/
│   ├── Logo.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Dropzone.tsx
│   ├── AnalyzeButton.tsx
│   ├── AnalyzingView.tsx        # spinner orbital + messages progressifs
│   ├── ResultView.tsx           # accueille reportHtml | null (iframe prêt)
│   ├── ErrorBanner.tsx
│   └── GrainOverlay.tsx
├── hooks/
│   └── useControleSubmit.ts     # useReducer + AbortController 180 s
└── lib/
    ├── api.ts                   # submitControle() + ControleError — fetch direct n8n
    ├── constants.ts             # MAX_FILE_SIZE, PROGRESS_STEPS, timeout
    └── validation.ts            # validatePdf + validateFilePair

screenshots/                     # Captures de référence des 3 états
```

---

## Évolutions prévues

- **Retour HTML dans la réponse** : le workflow n8n retourne `report_html` dans le payload JSON — `ResultView` affiche alors le rapport dans une iframe.
- **Bouton "Télécharger le rapport"** : une fois le HTML disponible, ajouter un export PDF client-side.
# hercule-vs-chacale
# hercule-vs-chacale
