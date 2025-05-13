import { SimpleGrid, Stack, Text, Input, IconButton, HStack, Link, Image } from '@chakra-ui/react';
import { FaTelegram, FaDiscord } from 'react-icons/fa';
import { BiMailSend } from 'react-icons/bi';
import AppConfig from '@/utils/config';
import { FaX } from 'react-icons/fa6';
import { ReactNode } from 'react';

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
            {children}
        </Text>
    );
};

export default function Footer() {
    return (
        <Stack bgColor={"main"} color={'gray.200'} borderTop="1px solid" borderBottomColor="gray.400" as={Stack} width="100%" py={10} alignItems="center" minH="24.4vh">
            <SimpleGrid templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }} justifyItems="center" width="60%" gap="5">
                <Stack>
                    <HStack gap="3">
                        <Link href="/">
                            <Image src={"/logo.png"} height={65} alt="Solgotchi"/>
                        </Link>
                        <HStack alignItems="end">
                            <Text fontSize="2xl" px="1" mb="-1" fontFamily="CustomFont" fontWeight="900" color="main">Solgotchi</Text>
                        </HStack>
                    </HStack>
                    <Text fontSize={'sm'}>
                        © 2025 Solgotchi. All rights reserved
                    </Text>
                    <Stack direction={'row'}>
                        <Link href={AppConfig.telegramURL} target="_blank">
                            <IconButton bg={'whiteAlpha.100'} rounded={'full'}>
                                <FaTelegram color='white'/>
                            </IconButton>
                        </Link>
                        <Link href={AppConfig.discordURL} target="_blank">
                            <IconButton bg={'whiteAlpha.100'} rounded={'full'}>
                                <FaDiscord color='white'/>
                            </IconButton>
                        </Link>
                        <Link href={AppConfig.xURL} target="_blank">
                            <IconButton bg={'whiteAlpha.100'} rounded={'full'}>
                                <FaX color='white' width="10"/>
                            </IconButton>
                        </Link>
                    </Stack>
                </Stack>
                <Stack width="100%" gap="0">
                    <ListHeader>Support</ListHeader>
                    <Link href={AppConfig.telegramURL}>Telegram</Link>
                    <Link href={AppConfig.discordURL}>Discord</Link>
                    <Link href={AppConfig.xURL}>x.com</Link>
                </Stack>
                <Stack width="100%"  gap="0">
                    <ListHeader>Developer</ListHeader>
                    <Text>Powered By</Text>
                    <Link href={'https://t.me/justinternetmoneyz'} target='_blank' style={{ color: "#e29543" }} rel="noreferrer">Kira</Link>
                </Stack>
                <Stack width="100%"  gap="0">
                    <ListHeader>Stay up to date</ListHeader>
                    <Stack direction={'row'}>
                        <Input placeholder={'Your email address'} bg={'whiteAlpha.100'} border={0} _focus={{ bg: 'whiteAlpha.300' }} />
                        <IconButton aria-label="Subscribe" cursor="not-allowed">
                            <BiMailSend />
                        </IconButton>
                    </Stack>
                </Stack>
            </SimpleGrid>
        </Stack>
    );
}