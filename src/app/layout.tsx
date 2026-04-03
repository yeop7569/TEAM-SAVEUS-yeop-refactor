import "./globals.css";

export const metadata = {
  title: "SAVE US - AI 코드 보안 감사 솔루션",
  description: "AI를 통해 코드 보안 취약점을 자동으로 분석하고 개선 방안을 제공하는 서비스입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col justify-center items-center">
        {children}
      </body>
    </html>
  );
}
