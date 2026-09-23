# Shaddai's Shop — GitHub Pages

Tienda estática para GitHub Pages con catálogo en `data/productos.json` y un administrador integrado para **agregar, editar y eliminar productos**. Los cambios del administrador se publican directamente en el repositorio mediante la API de GitHub.

## Estructura

```text
Shaddai-Shop/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── config.js
└── data/
    └── productos.json
```

El catálogo inicial conserva los 26 productos del proyecto original.

## 1. Subir el proyecto a GitHub

Crea un repositorio nuevo y sube los archivos manteniendo exactamente la estructura anterior.

En **Settings → Pages**, selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.

Cuando GitHub Pages esté activo, la tienda se podrá abrir desde la URL que GitHub indique.

## 2. Crear la GitHub App

La edición del catálogo usa una **GitHub App** con autorización de usuario. GitHub permite generar user access tokens para una GitHub App y limitar sus permisos; los tokens de usuario pueden expirar y renovarse mediante refresh token.

En GitHub ve a **Settings → Developer settings → GitHub Apps → New GitHub App** y configura:

- Nombre: cualquiera que identifique tu administrador.
- **Device Flow: Enabled**.
- Repository permissions: **Contents → Read and write**.
- Repository permissions: **Metadata → Read**.
- Para una tienda administrada por una sola cuenta, instala la aplicación únicamente en los repositorios que necesite.

GitHub permite instalar una App seleccionando todos los repositorios o solamente repositorios concretos.

Después de crearla, copia su **Client ID**. El Client ID no es un secreto y no debes colocar ningún `client_secret` en este proyecto.

## 3. Instalar la App en el repositorio

Desde la página de configuración de la GitHub App selecciona **Install App** y concede acceso al repositorio que contiene esta tienda. La App debe tener permiso para escribir el contenido del repositorio.

## 4. Conectar la tienda una sola vez

En la tienda:

1. Abre el menú lateral.
2. Entra en **Agregar producto**.
3. En la sección GitHub pulsa **🐙 Conectar GitHub**.
4. Introduce el **Client ID** de la GitHub App.
5. Si la página está publicada en GitHub Pages, el propietario y el repositorio se intentan detectar automáticamente desde la URL. También puedes escribirlos manualmente.
6. Pulsa **Autorizar con GitHub**.
7. GitHub mostrará un código de autorización. Ábrelo, introduce el código y aprueba el acceso.

La autorización queda guardada en este navegador. Los tokens de usuario de GitHub App expiran después de 8 horas por defecto; el refresh token puede renovarlos durante su periodo de validez, que por defecto es de 6 meses.

## 5. Funcionamiento del administrador

Una vez conectado:

```text
Agregar producto
      ↓
Guardar producto
      ↓
actualizar data/productos.json
      ↓
GitHub API
      ↓
commit automático
```

Lo mismo ocurre al **editar**, **eliminar** o **importar** el catálogo.

El administrador obtiene el `SHA` actual del archivo antes de actualizarlo y utiliza la API de contenidos de GitHub para crear el commit. La API de GitHub admite la creación y actualización de archivos del repositorio mediante este mecanismo.

## 6. Seguridad

No introduzcas un Client Secret, Personal Access Token ni ninguna otra credencial secreta dentro de `index.html` o `js/config.js`.

Este proyecto usa el **Device Flow** porque permite completar la autorización con el Client ID sin exponer un client secret en una página estática. GitHub documenta que el flujo de dispositivo no necesita client secret para obtener el user access token.

Los tokens de sesión se almacenan en el navegador que utiliza el administrador. Mantén la página de administración libre de scripts de terceros innecesarios y evita introducir código de origen desconocido.

## 7. Configuración opcional

`js/config.js` puede permanecer con valores vacíos. El administrador permite introducirlos desde la interfaz y conservar la configuración en el navegador.

También puedes dejar preconfigurados:

```js
window.SHADDAI_CONFIG = {
  github: {
    appClientId: "TU_CLIENT_ID",
    owner: "TU_USUARIO",
    repo: "TU_REPOSITORIO",
    branch: "main",
    path: "data/productos.json",
    apiVersion: "2026-03-10"
  }
};
```

El `appClientId` es público; **no** pongas un client secret ahí.

## 8. Después de publicar

No necesitas volver a seleccionar `productos.json`. El archivo remoto de GitHub es la fuente del catálogo y cada cambio realizado desde el administrador se publica mediante un commit. Si GitHub Pages tarda en reconstruir la página, el contenido se actualizará cuando la nueva versión quede publicada.

Si la autorización se revoca o el refresh token de la GitHub App caduca, será necesario autorizar nuevamente la aplicación.

## Referencias oficiales

- GitHub App — user access tokens: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app
- GitHub App — refreshing user access tokens: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens
- GitHub App — installing your own app: https://docs.github.com/en/apps/using-github-apps/installing-your-own-github-app
- GitHub App — choosing permissions: https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app
- GitHub REST API — repository contents: https://docs.github.com/en/rest/repos/contents
