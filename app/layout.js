import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  verification: {
    google: "iJSpImcsjKHNovHphl2Dlw_L91n8ki-bAsD_1qXeir0",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}