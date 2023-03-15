import {useEffect, useRef} from "react";
import {useLogin, useRegister} from "@refinedev/core";
import {CredentialResponse} from "../../interfaces/google";

const clientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;


const GoogleButton = (): JSX.Element => {
    const {mutate: login} = useLogin<CredentialResponse>();
    const {mutate: register} = useRegister<CredentialResponse>()
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !window.google || !divRef?.current) {
            return;
        }

        try {
            window?.google?.accounts?.id?.initialize({
                ux_mode: "popup",
                client_id: clientId,
                callback: async (res) => {
                    if (res.credential) {
                        login(res);
                    }
                },
            });
            window?.google?.accounts?.id?.renderButton(divRef?.current, {
                theme: "filled_blue",
                size: "medium",
                type: "standard"
            });
        } catch (error) {
            console.log(error);
        }
    }, [clientId, window?.google, divRef?.current]); // you can also add your client id as dependency here

    return <div ref={divRef}/>;
};

export default GoogleButton;