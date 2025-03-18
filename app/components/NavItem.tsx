"use client"

import { Text, HStack, Link, Popover, Stack, Portal, Icon } from '@chakra-ui/react';
import { IoChevronDown } from "react-icons/io5";
import { usePathname } from 'next/navigation';
import SubNav, { ISubNav } from './SubNav';
import { FC } from 'react';

const NavItem: FC<ISubNav> = ({ label, children, href, href_blank, onToggle }) => {    
    const pathname = usePathname();
    const isCurrentPath = pathname === href || (href !== '/' && pathname.startsWith(href || '') && !href_blank);

    return (
        <Popover.Root positioning={{ placement: "bottom-start" }} autoFocus={false}>
            <Popover.Trigger asChild color={isCurrentPath ? 'white' : 'gray.400'} _hover={{ textDecoration: 'none', color: 'white' }} cursor="pointer" >
                {children ? (
                    <HStack gap="0">
                        <Text>{ label }</Text>
                        <Icon size="sm" ml="1" mt="1">
                            <IoChevronDown/>
                        </Icon> 
                    </HStack>
                ) : href_blank ? (
                    <Link target="_blank" href={href_blank} _hover={{ textDecoration: 'none' }}>
                        {label}
                    </Link>
                ) :
                (
                    <Link _hover={{ textDecoration: 'none' }} href={href || '/'} onClick={onToggle}>
                        {label}
                    </Link>
                )}
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    {children && (
                        <Popover.Content border={0} boxShadow={'xl'} p={4} rounded={'xl'} minW={'sm'}>
                        <Popover.Arrow/>

                            <Stack>
                                {children.map((child) => (
                                    <SubNav key={child.label} {...child} onToggle={onToggle} />
                                ))}
                            </Stack>
                        </Popover.Content>
                    )}
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};

export default NavItem;