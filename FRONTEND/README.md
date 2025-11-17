# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Environment Configuration

### Backend API URL

Create a `.env` file in the frontend root directory to configure the backend API URL:

```env
# For development (uses Vite proxy)
VITE_API_BASE_URL=/api

# For production (use full backend URL)
# VITE_API_BASE_URL=http://localhost:5000/api
# VITE_API_BASE_URL=https://api.yourdomain.com/api

# Backend server URL for Vite proxy (development only)
# VITE_BACKEND_URL=http://localhost:5000
```

**Note:** 
- In Vite, environment variables must be prefixed with `VITE_` to be exposed to client-side code
- For development, using `/api` with the Vite proxy is recommended
- For production builds, use the full backend URL including the `/api` path

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
