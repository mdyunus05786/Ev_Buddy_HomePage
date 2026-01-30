# Evbuddy Home Page

React (Vite) app lives in `evbuddy-react/`.

## 🔗 Access the Page

- **Live Site (GitHub Pages)**: [https://mdyunus05786.github.io/Ev_Buddy_HomePage/](https://mdyunus05786.github.io/Ev_Buddy_HomePage/)
- **Local Development**: `http://localhost:5173/` (after running dev server)
- **Repository**: [https://github.com/mdyunus05786/Ev_Buddy_HomePage](https://github.com/mdyunus05786/Ev_Buddy_HomePage)

## Run (recommended)

From this folder:

- Install: `npm run install:app`
- Dev: `npm run dev`
- Build: `npm run build`

Vite will print the local URL (usually `http://localhost:5173/`).

## Images

Put images in `evbuddy-react/public/images` and reference them like:

- `/images/your-file.png`

## 🔧 Troubleshooting

### GitHub Pages 404 Errors

If you see 404 errors for JavaScript/CSS assets on GitHub Pages:

1. **Check GitHub Pages is enabled**: Go to repository Settings → Pages → ensure "Source" is set to "GitHub Actions"
2. **Workflow must run on main branch**: The deployment workflow only runs on pushes to `main` branch
3. **Wait for deployment**: After pushing to `main`, check the Actions tab for deployment status
4. **Clear browser cache**: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R) to clear cached files

### Local Development Issues

If the dev server won't start:

```bash
# Make sure dependencies are installed first
npm run install:app

# Then start the dev server
npm run dev
```

### Build Issues

If the build fails:

```bash
# Clean install
rm -rf evbuddy-react/node_modules
npm run install:app
npm run build
```
