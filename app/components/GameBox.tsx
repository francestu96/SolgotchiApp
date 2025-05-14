"use client";

import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { toaster } from "@/app/components/Toaster"
import { Button, Icon, VStack } from "@chakra-ui/react";
import { UserType } from "@/utils/user";
import { FaCompressAlt, FaExpandAlt, FaTimes } from 'react-icons/fa';

export const GameBox = ({ userModel }: { userModel: UserType }) => {
    const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } = useUnityContext({
        loaderUrl: "build/solgotchi.loader.js",
        dataUrl: "build/solgotchi.data",
        frameworkUrl: "build/solgotchi.framework.js",
        codeUrl: "build/solgotchi.wasm",
    });
    const [isLandscape, setIsLandscape] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const unityCanvasRef = useRef<HTMLDivElement>(null);
    const originalStylesRef = useRef<Record<string, string>>({});
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const unityStyle = {
        width: '100%',
        height: '600px',
        background: '#231F20',
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: landscape)");
        
        setIsLandscape(mediaQuery.matches);
        
        const handleOrientationChange = (e: MediaQueryListEvent) => {
            setIsLandscape(e.matches);
        };
        
        mediaQuery.addEventListener("change", handleOrientationChange);
        
        const checkMobile = () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };
        
        setIsMobile(checkMobile());
        
        return () => {
            mediaQuery.removeEventListener("change", handleOrientationChange);
        };
    }, []);

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

    useEffect(() => {
        return () => {
            if (isFullscreen) {
                exitFullscreen();
            }
        };
    }, [isFullscreen]);
    
    useEffect(() => {
        const handleOrientationChange = () => {
            if (isFullscreen) {
                setTimeout(() => updateCanvasOrientation(), 300);
            }
        };
        
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
        
        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
        };
    }, [isFullscreen]);
    

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
    
    const updateCanvasOrientation = useCallback(() => {
        if (!unityCanvasRef.current) return;
        
        const canvas = unityCanvasRef.current.querySelector('canvas');
        if (!canvas) return;
        
        canvas.style.transform = '';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
    }, []);
      
    const saveOriginalStyles = useCallback((canvas: HTMLElement) => {
        originalStylesRef.current = {
            position: canvas.style.position,
            top: canvas.style.top,
            left: canvas.style.left,
            width: canvas.style.width,
            height: canvas.style.height,
            zIndex: canvas.style.zIndex,
            transform: canvas.style.transform
        };
    }, []);
    
    const addCloseButton = useCallback(() => {
        if (closeButtonRef.current && document.body.contains(closeButtonRef.current)) {
            alert("Tap the button to exit fullscreen");
            document.body.removeChild(closeButtonRef.current);
        }

        const button = document.createElement('button');
        button.id = 'unity-exit-fullscreen-button';
        
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '15px',
            right: '15px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontSize: '10px',
            border: '3px solid white',
            cursor: 'pointer',
            zIndex: '100000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            padding: '0',
            fontWeight: 'bold',
            userSelect: 'none',
            touchAction: 'manipulation'
        });
        
        button.onclick = exitFullscreen;
        const container = document.createElement('div');
        container.id = 'close-button-icon';
        button.appendChild(container);

        document.body.appendChild(button);
        closeButtonRef.current = button;

        // Monta l'icona React nel container usando ReactDOM
        import('react-dom/client').then(ReactDOMClient => {
            const root = ReactDOMClient.createRoot(container);
            root.render(<FaTimes size={16} color="white" />);
        });
        // button.ontouchend = (e) => {
        //     e.preventDefault();
        //     exitFullscreen();
        // };
        
        // document.body.appendChild(button);
        // closeButtonRef.current = button;
    }, []);
    
    const enterFullscreen = useCallback(() => {
        if (!unityCanvasRef.current) return;
        
        const canvas = unityCanvasRef.current.querySelector('canvas');
        if (!canvas) return;
        
        saveOriginalStyles(canvas);
        
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '9999';
        
        canvas.classList.add('fullscreen-mode');
        
        document.body.style.overflow = 'hidden';
        
        updateCanvasOrientation();
        
        setIsFullscreen(true);

        addCloseButton();
    }, [saveOriginalStyles, updateCanvasOrientation, addCloseButton]);
    
    const exitFullscreen = useCallback(() => {
        if (!unityCanvasRef.current) return;
        
        const canvas = unityCanvasRef.current.querySelector('canvas');
        if (!canvas) return;
        canvas.classList.remove('fullscreen-mode');
        
        Object.entries(originalStylesRef.current).forEach(([prop, value]) => {
            (canvas.style as any)[prop] = value || '';
        });
        
        document.body.style.overflow = '';
        
        if (closeButtonRef.current && document.body.contains(closeButtonRef.current)) {
            document.body.removeChild(closeButtonRef.current);
            closeButtonRef.current = null;
        }
        
        setIsFullscreen(false);
    }, []);
    
    const toggleFullscreenLandscape = useCallback(() => {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }, [isFullscreen, enterFullscreen, exitFullscreen]);

    return (
        <VStack alignContent="center" py="10">
            <div ref={unityCanvasRef}>
                <Unity unityProvider={unityProvider} style={unityStyle} />
            </div>
            {
                isMobile && !isFullscreen && (
                    <Button onClick={toggleFullscreenLandscape} mt="2" size="sm" fontSize="xs">
                        Enter fullscreen
                        <Icon>
                            <FaExpandAlt />
                        </Icon>
                    </Button>
                )
            }
        </VStack>
    );
}
