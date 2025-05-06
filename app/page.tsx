"use client"

import { Box, Container, VStack, Heading, Image, Text, Spinner } from "@chakra-ui/react";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { toaster } from "@/app/components/Toaster"
import { GameBox } from "./components/GameBox";
import { SignUp } from "./components/SignUp";
import { useState, useEffect } from "react";
import { UserType } from "@/utils/user";
import axios from "axios";

export default function Home() {
    const wallet = useAnchorWallet();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ userModel, setUserModel ] = useState<UserType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try{
                const res = await axios.get(`/api/users?address=${wallet!.publicKey}`);
                setUserModel(res.data);
            } 
            catch(error: any){
                if(error.status == 500){
                    console.error('Error fetching user data:', error);
                    toaster.create({ title: "Unable to retreve data... ", type: "error" })
                }
            }
            finally{
                setIsLoading(false);
            }
        };


        if(wallet){
            fetchData();
        }
    }, [wallet]);

    const renderComponent = () => {
        if (isLoading) {
            return (
                <VStack justifyContent="center" py="20">
                    <Spinner color="main" size="xl" borderWidth="4px"/>
                    <Text color="main" fontSize="xl" fontWeight="800">Loading...</Text>
                </VStack>
            )
        }

        if (userModel) {
            return <GameBox userModel={userModel}/>
        }

        return <SignUp address={wallet!.publicKey} setUserModel={setUserModel}/>
    }

    return (
        <Box bgColor="#1A202C" bgImage="url(/background.png)" bgSize="cover">
            <Container maxW="container.xl" minH="65vh">
                {
                    wallet ? (
                        renderComponent()
                    ) : (
                        <VStack w="100%" alignContent="center" py="20">
                            <Heading fontSize="3xl">Connect your Wallet</Heading>
                            <Image src="/connect.gif" width="50px" alt="connect"/>
                        </VStack>
                    )
                }
            </Container>
        </Box>
    );
}
