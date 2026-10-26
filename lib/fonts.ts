// App fonts. Geist for sans, JetBrains Mono for labels, eyebrows and figures.
// Swap either for your own brand font: next/font/local works the same way.
import { Geist, JetBrains_Mono } from "next/font/google";

export const sans = Geist({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
  display: "swap",
});
