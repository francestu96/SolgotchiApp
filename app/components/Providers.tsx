"use client"

import { SolflareWalletAdapter, PhantomWalletAdapter, TrustWalletAdapter, WalletConnectWalletAdapter, XDEFIWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from "react";

export function Providers(props: ThemeProviderProps) {
    const system = createSystem(defaultConfig, {
        theme: {
            tokens: {
                colors: {
                    main: { value: "#2a676c" },
                },
            },
        },
    });

    const network = process.env.NEXT_PUBLIC_APP_CHAIN === "mainnet-beta" ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new SolflareWalletAdapter(),
            new PhantomWalletAdapter(),
            new TrustWalletAdapter(),
            new WalletConnectWalletAdapter({ network, options: { metadata: { name: "Solgotchi", description: "Solgotchi", url: "", icons: [] } } }),
            new XDEFIWalletAdapter()
        ],
        [network]
    );

    return (
        <ChakraProvider value={system}>
            <ThemeProvider attribute="class" disableTransitionOnChange {...props}>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletModalProvider>
                            {props.children}
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </ThemeProvider>
        </ChakraProvider>
    )
}
