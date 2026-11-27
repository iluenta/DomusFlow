import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * The domain root intentionally has no landing page.
 * `hospyia.com/` returns 404; access is via /login and /dashboard.
 */
export default function RootPage() {
  notFound();
}
