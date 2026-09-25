# Shaddai's Shop — GitHub Pages + GitHub App + Cloudflare Worker

Tienda estática preparada para GitHub Pages con catálogo en `data/productos.json` y un administrador integrado para **agregar, editar, eliminar e importar productos**. Los cambios se publican automáticamente en GitHub mediante un Cloudflare Worker.

## Estructura

```text
Shaddai-Shop/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── config.js
└── data/
    └── productos.json
```

El catálogo inicial conserva los 26 productos del proyecto original.

## 1. Subir la tienda a GitHub

Crea el repositorio de GitHub para la tienda y sube exactamente la estructura anterior.

En **Settings → Pages**, selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.

## 2. Configurar la GitHub App

La tienda utiliza una **GitHub App** con Web Application Flow + PKCE. El navegador no conoce el Client Secret ni los tokens de GitHub.

En **GitHub → Settings → Developer settings → GitHub Apps → tu App → Edit** configura: **Enable Device Flow: desactivado**, **Request user authorization (OAuth) during installation: desactivado**, **Allow wildcard matching: desactivado** y Callback URL: `https://shaddai-shop-github-auth.djvm25.workers.dev/callback`.

En **Repository permissions** usa `Contents → Read & write` y `Metadata → Read-only`. Deja los demás permisos sin acceso. Instala la App únicamente en el repositorio de la tienda.

## 3. Configurar el Cloudflare Worker

El proyecto está preparado para usar este Worker:

`https://shaddai-shop-github-auth.djvm25.workers.dev`

El Worker debe tener:

- KV binding: `SHADDAI_AUTH`.
- Secret: `GITHUB_CLIENT_ID`.
- Secret: `GITHUB_CLIENT_SECRET`.
- Variable: `FRONTEND_URL` con la URL de GitHub Pages de la tienda.
- Variable: `GITHUB_OWNER` con el propietario del repositorio.
- Variable: `GITHUB_REPO` con el nombre del repositorio.
- Variable: `GITHUB_BRANCH` con `main`.
- Variable: `GITHUB_PRODUCTS_PATH` con `data/productos.json`.

El Worker debe exponer las rutas `/start`, `/callback`, `/api/session/exchange`, `/api/status`, `/api/logout` y `/api/products`.

## 4. Configuración del frontend

`js/config.js` contiene únicamente la URL pública del Worker y valores opcionales de referencia del repositorio. No coloques aquí Client Secret, refresh token, access token ni Personal Access Token.

El valor predeterminado del proyecto es:

```js
window.SHADDAI_CONFIG = {
  github: {
    workerUrl: "https://shaddai-shop-github-auth.djvm25.workers.dev",
    owner: "",
    repo: "",
    branch: "main",
    path: "data/productos.json"
  }
};
```

Si quieres mostrar el propietario y repositorio directamente en el estado del administrador, puedes rellenar `owner` y `repo`, pero no es necesario para la sincronización: el Worker es la fuente de configuración real.

## 5. Conectar la tienda una sola vez

1. Abre el menú lateral.
2. Entra en **Agregar producto**.
3. En la sección GitHub pulsa **🐙 Conectar GitHub**.
4. Pulsa **Autorizar con GitHub**.
5. GitHub mostrará la autorización de la GitHub App. Aprueba el acceso.
6. GitHub volverá automáticamente a la tienda.

No se selecciona ningún `productos.json` local y no se introduce ningún secreto en la tienda.

## 6. Gestión del catálogo

Una vez conectado GitHub, guardar un producto nuevo, editarlo, eliminarlo o importar un catálogo provoca una petición al Worker. El Worker obtiene el `SHA` actual y actualiza `data/productos.json` mediante un commit en GitHub.

Si el archivo remoto cambió desde que el navegador lo leyó, el Worker devuelve un conflicto para evitar sobrescribir cambios de otra sesión. Usa **Sincronizar ahora** antes de volver a guardar.

## 7. Sesiones y seguridad

El Worker maneja el intercambio OAuth y guarda el estado temporal, las sesiones y los refresh tokens en Cloudflare KV. El navegador conserva solamente un token de sesión propio de la aplicación. Cloudflare Secrets se utilizan para almacenar las credenciales sensibles del Worker.

No introduzcas el Client Secret, un Personal Access Token ni un access token de GitHub en `index.html`, `js/app.js` o `js/config.js`.

GitHub utiliza tokens de usuario expirables para las GitHub Apps y admite su renovación mediante refresh token.

## 8. Flujo general

```text
GitHub Pages
    │
    │ Conectar GitHub
    ▼
Cloudflare Worker /start
    │
    ▼
GitHub OAuth + PKCE
    │
    ▼
Worker /callback
    │
    ▼
Sesión de aplicación
    │
    ├── GET  /api/products
    └── PUT  /api/products
              │
              ▼
        GitHub API
              │
              ▼
     data/productos.json
```

## Referencias oficiales

- GitHub App — user access tokens: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app
- GitHub App — callback URL: https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/about-the-user-authorization-callback-url
- GitHub REST API — repository contents: https://docs.github.com/en/rest/repos/contents
- Cloudflare Workers Secrets: https://developers.cloudflare.com/workers/configuration/secrets/
- Cloudflare KV bindings: https://developers.cloudflare.com/kv/concepts/kv-bindings/
