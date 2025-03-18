import { Box, Stack, Text, Image, Separator, Button, Field, Input, HStack } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { toaster } from "./Toaster";
import { useState } from "react";
import axios from "axios";

export const SignUp = ({ address }: { address: PublicKey }) => {
    const [username, setUsername] = useState<string>("");
    const [referral, setReferral] = useState<string | null>();
    const [requiredError, setRequiredError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const signUp = async () => {
        if(username){
            try{
                const res = await axios.post(`/api/users?address=${address}`, { username, referral });
            }
            catch (err: any) {
                console.error(err.toString());
                toaster.create({ title: err.message, type: "error" })
            }
        }
        else{
            setRequiredError(true);
            toaster.create({ title: "Fill the username field", type: "error" })
        }
    }

    return (
        <Box w="80%" borderRadius='lg' display="flex" p="10" borderWidth={1} pt="28" mx="auto">
            <Stack w="100%" alignItems="center" bgColor="#2D3748" borderRadius="xl" border="1px solid gray">
                <Box mt='-4em' height={'8em'}>
                    <Image alt="" m='auto' w="40%" src="/logo.png"/>
                </Box>
                <HStack fontSize="xl" fontWeight="bold">
                    <Text> Start your journey with </Text>
                    <Text mb="1" color="#00ABB8" fontFamily="Solgotchi" fontSize="50px">Solgotchi</Text>
                </HStack>
                <Separator mb="2" borderColor='#00ABB8' width="90%"/>
                <Stack mb="10" mt="5">
                    <Field.Root required invalid={errorMessage ? true : false}>
                        <Field.Label>
                            Username
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input placeholder="Your username..." onChange={(e) => {setUsername(e.target.value); setRequiredError(false)}} borderColor={requiredError ? "red" : "inherit"}/>
                        <Field.ErrorText>{errorMessage}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root mb="3">
                        <Field.Label>
                            Referral
                        </Field.Label>
                        <Input placeholder="Referral address..." onChange={(e) => setReferral(e.target.value)}/>
                    </Field.Root>

                    <Button onClick={signUp}>Get Started!</Button>
                </Stack>
            </Stack>
        </Box>
    );
}