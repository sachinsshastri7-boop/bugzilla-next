import "./globals.css";

export const metadata = {
  title: "Bugzilla 2.0 - Modern Issue Tracker",
  description: "Collaborative software bug and defect management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}