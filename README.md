# Strategy & Ops — Chantiers Transverses

Outil de suivi des projets transverses pour l'équipe Strategy & Operations.

## Déploiement rapide sur Vercel (3 min)

### Option A : Via GitHub (recommandé)

1. **Créer un repo GitHub**
   - Va sur [github.com/new](https://github.com/new)
   - Nom : `strategy-ops-tracker` (ou ce que tu veux)
   - Privé ou public, comme tu préfères

2. **Push le code**
   ```bash
   cd strategy-ops-tracker
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TON-USERNAME/strategy-ops-tracker.git
   git push -u origin main
   ```

3. **Connecter à Vercel**
   - Va sur [vercel.com](https://vercel.com) → Sign up avec GitHub
   - Clique "Add New Project"
   - Importe ton repo `strategy-ops-tracker`
   - Framework Preset : **Vite** (auto-détecté)
   - Clique **Deploy**
   - En ~30 secondes, tu as une URL live type `strategy-ops-tracker.vercel.app`

### Option B : Via Vercel CLI (encore plus rapide)

```bash
npm i -g vercel
cd strategy-ops-tracker
vercel
```

Suis les prompts, et c'est déployé.

## Dev local

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173

## Stack

- React 18
- Vite
- Pas de dépendances externes (tout vanilla)
