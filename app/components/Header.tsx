"use client"

import { Box, HStack, IconButton, VStack, Drawer, Image, Link, CloseButton, Portal } from '@chakra-ui/react';
import { RxHamburgerMenu } from "react-icons/rx";
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const Header = () => {
    const [open, setOpen] = useState(false)
    
    return (
        <Box borderBottom="1px solid" borderBottomColor="gray.400" px={["5", "10", "15", "48"]} bgColor={"main"}>
            <HStack justify="space-between" display={['none', 'none', 'flex', 'flex']}>
                <Link href="/">
                    <Image src={"/logo.png"} height={100} alt="Solgotchi" />
                </Link>
                <HStack gap={'10px'}>
                    <WalletMultiButtonDynamic style={{ height: "2.7rem", backgroundColor: "white", color: "#27272a", borderRadius: "10px" }} />
                </HStack>
            </HStack>
            <HStack justify="space-between" display={['flex', 'flex', 'none', 'none']}>
                <Link href="/">
                    <Image src={"/logo.png"} height={65} alt="Solgotchi" />
                </Link>
                <Drawer.Root size="full" open={open} onOpenChange={(e) => setOpen(e.open)}>
                    <Drawer.Trigger asChild>
                        <IconButton>
                            <RxHamburgerMenu/>
                        </IconButton>
                    </Drawer.Trigger>
                    <Portal>
                        <Drawer.Positioner>
                            <Drawer.Content alignItems="center">
                                <Drawer.Header/>
                                <Drawer.Body>
                                    <VStack gap="5" fontSize="md" onClick={() => setOpen(false)}>
                                        <WalletMultiButtonDynamic style={{ height: "2.7rem", backgroundColor: "white", color: "#27272a", borderRadius: "10px" }} />
                                    </VStack>
                                </Drawer.Body>
                                <Drawer.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Drawer.CloseTrigger>
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                </Drawer.Root>
            </HStack>
        </Box>
    );
};

export default Header;