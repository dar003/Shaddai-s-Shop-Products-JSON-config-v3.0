/*
  Configuración pública de la tienda.
  No pongas aquí client secrets ni tokens.
  El Client ID de una GitHub App es público. También puedes introducirlo una sola vez desde el panel de Gestión de productos.
*/
window.SHADDAI_CONFIG = {
  github: {
    appClientId: "",
    owner: "",
    repo: "",
    branch: "main",
    path: "data/productos.json",
    apiVersion: "2026-03-10"
  }
};
