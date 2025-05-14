"use client";

import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useCallback, useEffect, useState } from "react";
import { Spinner, VStack, Text } from "@chakra-ui/react";
import { toaster } from "@/app/components/Toaster"
import { UserType } from "@/utils/user";

export const GameBox = ({ userModel }: { userModel: UserType }) => {
    const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } = useUnityContext({
        loaderUrl: "build/solgotchi.loader.js",
        dataUrl: "build/solgotchi.data",
        frameworkUrl: "build/solgotchi.framework.js",
        codeUrl: "build/solgotchi.wasm",
    });
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const unityStyle: React.CSSProperties = { width: "85%", display: isLoaded ? "block" : "none" };

    useEffect(() => {
        const checkMobile = () => {
            return (/phantom/i.test(navigator.userAgent) ||/WebView/i.test(navigator.userAgent) ||/FBAN|FBAV|Instagram|Snapchat|Line/i.test(navigator.userAgent));
        };
        
        if(checkMobile()){
            toaster.create({ title: "To correctly rotate this app, open it on Safari or external browser", type: "warning", duration: 100000 });
        }
    }, []);

    const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

    useEffect(
        function () {
            const updateDevicePixelRatio = function () {
                setDevicePixelRatio(window.devicePixelRatio);
            };
            const mediaMatcher = window.matchMedia(
                `screen and (resolution: ${devicePixelRatio}dppx)`
            );
            mediaMatcher.addEventListener("change", updateDevicePixelRatio);
            return function () {
                mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
            };
        },
        [devicePixelRatio]
    );

    useEffect(() => {
        if (userModel && isLoaded) {
            window.addEventListener('unload', onUnload);

            addEventListener("onTokensBought", onTokensBought);
            addEventListener("onPetNameChange", onPetNameChange);
            addEventListener("onLevelChange", onLevelChange);
            addEventListener("onExpChange", onExpChange);
            addEventListener("onGoldChange", onGoldChange);
            addEventListener("onTokensChange", onTokensChange);
            addEventListener("onHighScoreChange", onHighScoreChange);
            addEventListener("onHungerChange", onHungerChange);
            addEventListener("onHygieneChange", onHygieneChange);
            addEventListener("onFunChange", onFunChange);
            addEventListener("onEnergyChange", onEnergyChange);
            addEventListener("onLightOutChange", onLightOutChange);
            addEventListener("onActiveWallpaperChange", onActiveWallpaperChange);
            addEventListener("onActiveClothChange", onActiveClothChange);
            addEventListener("onSaveItem", onSaveItem);
            addEventListener("onRemoveItem", onRemoveItem);

            sendMessage("GameStartupManager", "ReceiveInitData", JSON.stringify(userModel));

            return () => {
                window.removeEventListener('unload', onUnload);

                removeEventListener("onTokensBought", onTokensBought);
                removeEventListener("onPetNameChange", onPetNameChange);
                removeEventListener("onLevelChange", onLevelChange);
                removeEventListener("onExpChange", onExpChange);
                removeEventListener("onGoldChange", onGoldChange);
                removeEventListener("onTokensChange", onTokensChange);
                removeEventListener("onHighScoreChange", onHighScoreChange);
                removeEventListener("onHungerChange", onHungerChange);
                removeEventListener("onHygieneChange", onHygieneChange);
                removeEventListener("onFunChange", onFunChange);
                removeEventListener("onEnergyChange", onEnergyChange);
                removeEventListener("onLightOutChange", onLightOutChange);
                removeEventListener("onActiveWallpaperChange", onActiveWallpaperChange);
                removeEventListener("onActiveClothChange", onActiveClothChange);
                removeEventListener("onSaveItem", onSaveItem);
                removeEventListener("onRemoveItem", onRemoveItem);
            };
        }

    }, [userModel, isLoaded, addEventListener]);    

    const onUnload = useCallback(() => {
        const blob = new Blob([JSON.stringify(userModel)], { type: 'application/json' });
        fetch("/api/users?action=update", {
            method: "POST",
            body: blob,
            headers: {
                "Content-Type": "application/octet-stream",
            },
            keepalive: true
        });
    }, []);
    const onPetNameChange = useCallback((petName: any) => {
        userModel.pet.name = petName;
    }, []);
    const onLevelChange = useCallback((level: any) => {
        userModel.level = level;
    }, []);
    const onExpChange = useCallback((exp: any) => {
        userModel.exp = exp;
    }, []);
    const onGoldChange = useCallback((gold: any) => {
        userModel.gold = gold;
    }, []);
    const onTokensChange = useCallback((tokens: any) => {
        userModel.tokens = tokens;
    }, []);
    const onHighScoreChange = useCallback((highScore: any) => {
        userModel.highScore = highScore;
    }, []);
    const onHungerChange = useCallback((hunger: any) => {
        userModel.pet.hunger = hunger;
    }, []);
    const onHygieneChange = useCallback((hygiene: any) => {
        userModel.pet.hygiene = hygiene;
    }, []);
    const onFunChange = useCallback((fun: any) => {
        userModel.pet.fun = fun;
    }, []);
    const onEnergyChange = useCallback((energy: any) => {
        userModel.pet.energy = energy;
    }, []);
    const onLightOutChange = useCallback((isLightOn: any) => {
        userModel.pet.isLightOn = isLightOn == 0;
    }, []);
    const onActiveWallpaperChange = useCallback((wallpaperId: any) => {
        userModel.activeWallpaperId = wallpaperId;
    }, []);
    const onActiveClothChange = useCallback((clothId: any) => {
        userModel.activeClothId = clothId;
    }, []);
    const onSaveItem = useCallback((itemId: any, quantity: any) => {
        const existingItem = userModel.inventory.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            userModel.inventory.push({ id: itemId, quantity });
        }
    }, []);
    const onRemoveItem = useCallback((itemId: any) => {
        userModel.inventory = userModel.inventory.filter(item => item.id !== itemId);
    }, []);

    const onTokensBought = useCallback((tokensCount: any, tokenPrice: any) => {
        const handleTokensBought = async () => {
            const lamports = Math.ceil(LAMPORTS_PER_SOL * tokenPrice * tokensCount);
            const tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey!,
                    toPubkey: new PublicKey(process.env.NEXT_PUBLIC_RECEIVER_ADDRESS!),
                    lamports: lamports,
                })
            );
    
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.feePayer = publicKey!;
    
            const txId = await sendTransaction(tx, connection);
            await connection.confirmTransaction({
                blockhash: blockhash,
                lastValidBlockHeight: lastValidBlockHeight,
                signature: txId
            });

            userModel.tokens += tokensCount;
            sendMessage("CurrencyManager", "AddTokens", tokensCount);
            toaster.create({ title: "Transaction complete!", type: "success" })
        };
    
        handleTokensBought().catch((error) => {
            console.error("Error sending transaction:", error);
            toaster.create({ title: "Transaction failed", type: "error" });
        });
    }, []);

    return (
        <VStack alignContent="center" py="10">
            <Unity unityProvider={unityProvider} style={unityStyle} devicePixelRatio={devicePixelRatio}/>
            {
                !isLoaded && (
                    <VStack justifyContent="center" py="10">
                        <Spinner color="main" size="xl" borderWidth="4px"/>
                        <Text color="main" fontSize="xl" fontWeight="800">Loading...</Text>
                    </VStack>
                )
            }
        </VStack>
    );
}
