import { Box, Stack, Text, Image } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { UserType } from "@/utils/user";

export const GameBox = ({ address, userModel }: { address: PublicKey, userModel: UserType }) => {
    return (
        <Box w="80%" borderRadius='lg' p="10" bgColor="gray.700" borderWidth={1} mt="20">
            Game...
        </Box>
    );
}