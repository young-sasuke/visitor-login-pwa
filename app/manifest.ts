import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Visitor Login - VMS",
    short_name: "VMS Login",
    description: "Visitor Management System - OTP-based login for visitors",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5B21B6",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
