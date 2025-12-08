import React from "react";
// import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import GoogleAnalyticsInit from "@/lib/ga";
import { fontVariables } from "@/lib/fonts";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { ActiveThemeProvider } from "@/components/active-theme";
import { DEFAULT_THEME } from "@/lib/themes";
import { Toaster } from "@/components/ui/sonner";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SiteHeader } from "@/components/layout/header";

export default async function CombinedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ---------------- Root Layout Logic ----------------
  // const cookieStore = await cookies();

  const themeSettings = {
    preset: DEFAULT_THEME.preset,
    scale: DEFAULT_THEME.scale,
    radius:  DEFAULT_THEME.radius,
    contentLayout:DEFAULT_THEME.contentLayout
  };

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([_, value]) => value)
      .map(([key, value]) => [
        `data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value
      ])
  );

  // ---------------- Sidebar Logic ----------------
  const defaultOpen = false;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn("bg-background group/layout font-sans", fontVariables)}
        {...bodyAttributes}>
        {/* ThemeProvider is OK here: it is a client component but layout remains server component */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          <ActiveThemeProvider initialTheme={themeSettings}>
            <SidebarProvider
              defaultOpen={defaultOpen}
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 64)",
                  "--header-height": "calc(var(--spacing) * 14)"
                } as React.CSSProperties
              }>
              <AppSidebar variant="inset" />

              <SidebarInset>
                <SiteHeader />

                <div className="flex flex-1 flex-col">
                  <div className="@container/main p-4 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto">
                    {children}
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>

            <Toaster position="top-center" richColors />

            <NextTopLoader
              color="var(--primary)"
              showSpinner={false}
              height={2}
              shadow-sm="none"
            />

            {/* {process.env.NODE_ENV === "production" ? <GoogleAnalyticsInit /> : null} */}
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
