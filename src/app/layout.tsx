import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Buddy - Private Atelier",
  description: "Classic Edition Interview Preparation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        style={{ 
          margin: 0, 
          backgroundColor: "#FDFBF7",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#1A1A1A",
          WebkitFontSmoothing: "antialiased"
        }} 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}