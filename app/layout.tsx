import "./globals.css";

export const metadata = {
  title: "Noesis",
  description: "An intelligent learning workspace"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
