import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EstateFlow - Real Estate Marketplace",
  description: "Encuentra tu próxima propiedad ideal con EstateFlow. Compra, renta e invierte en inmuebles exclusivos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-clear-day text-nordic font-sans">
        {children}
      </body>
    </html>
  );
}
