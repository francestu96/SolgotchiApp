import { Box, Stack, Text, Image, Separator, Button, Field, Input, HStack } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { toaster } from "./Toaster";
import { useState } from "react";
import axios from "axios";

export const SignUp = ({ address, setUserModel }: { address: PublicKey, setUserModel: any }) => {
    const [username, setUsername] = useState<string>("");
    const [referral, setReferral] = useState<string | null>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requiredError, setRequiredError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const signUp = async () => {
        setIsLoading(true);
        if(username){
            try{
                const res = await axios.post(`/api/users?address=${address}`, { username, referral });
                setUserModel(res.data);
            }
            catch (err: any) {
                if(err.status == 409){
                    setErrorMessage(err.response.data.error);
                }
                else {
                    toaster.create({ title: err.response.data.error, type: "error" })
                }
            }
        }
        else{
            setRequiredError(true);
            toaster.create({ title: "Fill the username field", type: "error" })
        }
        setIsLoading(false);
    }

    return (
        <Box w={["100%", "90%", "80%"]} borderRadius='lg' display="flex" p={["10", "15", "20"]} mx="auto">
            <Stack w="100%" alignItems="center" bgColor="#2D3748" borderRadius="xl" border="1px solid gray">
                <Box mt={["-2em", "-3em", "-4em"]} height={["6em", "7em", "8em"]}>
                    <Image alt="" m="auto" w="40%" src="/logo.png"/>
                </Box>
                <Stack fontSize="xl" fontWeight="bold" direction={["column", "row"]} alignItems="center" justifyContent="center" mb="2">
                    <Text> Start your journey with </Text>
                    <Text mb="1" color="#00ABB8" fontFamily="Solgotchi" fontSize={["40px", "45px", "50px"]}>Solgotchi</Text>
                </Stack>
                <Separator mb="2" borderColor='#00ABB8' width="90%"/>
                <Stack mb="10" mt="2">
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

                    <Button onClick={signUp} loading={isLoading}>Get Started!</Button>
                </Stack>
            </Stack>
        </Box>
    );
}