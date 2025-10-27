
# Combined Fullstack App

This project merges your backend (`/server`) and frontend (`/client`) into a single deployable app.

## How it works
- The backend runs from `/server` (detected entry: `src/server.js`).
- On build, the frontend (`/client`) is built for production.
- The server auto-serves the built frontend (`/client/build` or `/client/dist`).

## Scripts (root)
- `npm install` → installs server and client deps
- `npm run build` → builds the client
- `npm start` → starts the backend (and serves the built frontend)

## Deploy to Render
1. Create a new **Web Service** on Render from this zip.
2. Render will use `render.yaml` or set manually:
   - Build command: `npm run build`
   - Start command: `npm start`

## Notes
- Static hosting injection: **Express not found or already injected**.
- If your backend already calls `app.listen(...)`, it will continue to work.
