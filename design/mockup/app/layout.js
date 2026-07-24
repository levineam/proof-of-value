import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { VoteProvider } from "@/lib/store";
import TabBar from "@/components/TabBar";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Proof of Value",
  description: "UI prototype — stake-weighted content rewards on open social",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FBF7EF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <VoteProvider>
          <div className="shell">
            {children}
            <TabBar />
          </div>
        </VoteProvider>
      </body>
    </html>
  );
}
