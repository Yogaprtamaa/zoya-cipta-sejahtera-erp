import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zoya Cipta ERP Prototype",
  description: "Interactive prototype ERP konsinyasi, maklon, dan company profile PT Zoya Cipta Sejahtera"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 selection:bg-brand-100 selection:text-brand-900">{children}</body>
    </html>
  );
}
