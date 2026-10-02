export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{margin:0, background:"#FDFBF7"}} suppressHydrationWarning>{children}</body>
    </html>
  );
}