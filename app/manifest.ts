import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Hospyia",
    short_name: "Hospyia",
    description:
      "Panel de gestión de Hospyia para anfitriones y sus propiedades.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    lang: "es",
    background_color: "#f7f8f9",
    theme_color: "#14584c",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
