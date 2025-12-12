import "./globals.css";
import { Providers } from "./providers";
import LanguageProvider from "./components/LanguageProvider";

export const metadata = {
  title: "ChatEase AI - Premium Auto-Reply Agent",
  description: "Automate your WhatsApp Business with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
