import "./globals.css";
import { CSPostHogProvider } from "./providers";

export const metadata = {
  title: "All of .nyc",
  description: "What's up with .nyc websites?",
  site_name: "All of .nyc",
  url: "https://www.allof.nyc/",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body className={`antialiased`}>
          <div className="max-w-6xl mx-auto py-10 px-4">{children}</div>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
