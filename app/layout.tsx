import '@solana/wallet-adapter-react-ui/styles.css';
import { Providers } from "./components/Providers";
import { Toaster } from './components/Toaster';
import Header from './components/Header';
import Footer from './components/Footer';
import type { Metadata } from "next";
import './global.css'

export const metadata: Metadata = {
    title: "Solgotchi | App",
    description: "Feed your Solgotchi and earn points!",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <Toaster />
                    <Header />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
