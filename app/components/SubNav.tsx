"use client"

import { Stack, Flex, Box, Text, Link, Image, Icon } from '@chakra-ui/react';
import { IoChevronForward } from "react-icons/io5";

export interface ISubNav {
    label: string;
    href?: string;
    href_blank?: string;
    subLabel?: string;
    logo?: string;
    children?: Array<ISubNav>;
    onToggle?: never;
}

const SubNav = ({ label, href, href_blank, subLabel, logo, onToggle }: ISubNav) => {
    return (
        <Link onClick={onToggle} target={href_blank ? "_blank" : ""} href={href || href_blank || '#'} className="group" display={'block'} p={2} rounded={'md'} _hover={{ bg: 'gray.900' }}>
            <Stack direction={'row'} align={'center'} gap="5">
                <Image src={logo} width={30} height={30} id={`${label}-navitem`} alt="item logo" />
                <Box>
                    <Text transition={'all .3s ease'} _groupHover={{ color: "#2a676c" }} fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex transition={'all .3s ease'} transform={'translateX(-10px)'} opacity={0} _groupHover={{ opacity: '100%', transform: 'translateX(0)' }} justify={'flex-end'} align={'center'} flex={1}>
                    <Icon color="#2a676c" w={5} h={5}>
                        <IoChevronForward/>
                    </Icon>
                </Flex>
            </Stack>
        </Link>
    );
};

export default SubNav;