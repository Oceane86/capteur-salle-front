// src/app/layout.tsx
import "@/app/styles/globals.css";

export const metadata = {
  title: "Digital Campus",
  description: "Surveillance des salles en temps réel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
