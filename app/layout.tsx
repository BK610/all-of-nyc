import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { CSPostHogProvider } from "./providers";

export const metadata = {
  title: "All of .nyc",
  description: "What's up with .nyc websites?",
  site_name: "All of .nyc",
  url: "https://www.allof.nyc/",
};

export default function RootLayout({ children }): React.ReactElement {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body className={`bg-amber-50 antialiased min-h-screen flex flex-col`}>
          <main className="flex-1 w-full max-w-6xl mx-auto pt-10 pb-2 px-4">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
