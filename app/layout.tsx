import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://ui.fabrials.com"),
  title: {
    default: "Fabrials UI — Built for people. Ready for agents.",
    template: "%s · Fabrials UI",
  },
  description:
    "Open-source shadcn components for WebMCP and MCP. Build interfaces that people and AI agents can use together.",
  openGraph: {
    title: "Fabrials WebMCP UI",
    description: "Open code. Shared interfaces. Built with shadcn.",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('fabrials-ui-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch{}`,
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only z-50 rounded bg-background p-3 focus:not-sr-only focus:fixed"
        >
          Skip to content
        </a>
        <TooltipProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
