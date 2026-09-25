/*
  Configuración pública de la tienda.
  El Client Secret y los tokens NO se colocan aquí: viven en el Cloudflare Worker.
*/
window.SHADDAI_CONFIG = {
  github: {
    workerUrl: "https://shaddai-shop-github-auth.djvm25.workers.dev",
    owner: "",
    repo: "",
    branch: "main",
    path: "data/productos.json"
  }
};
