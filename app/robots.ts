import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/registro",
          "/verificar-email",
          "/recuperar-contrasena",
          "/restablecer-contrasena",
          "/auth/",
          "/dashboard",
        ],
      },
    ],
    host: new URL(getSiteUrl()).host,
  };
}
