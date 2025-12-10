import "./globals.css";

export const metadata = {
  title: "ChatEase AI - Premium Auto-Reply Agent",
  description: "Automate your WhatsApp Business with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
