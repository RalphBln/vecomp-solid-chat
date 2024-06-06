import { Chat } from './Chat';
import { User } from "@chatscope/use-chat";
import { useState, useEffect } from "react";
import Creatable from 'react-select/creatable';
import { useSession, LoginButton, LogoutButton } from "@inrupt/solid-ui-react";
import { identityProviderOptions } from './solid-identityproviders';

export const SolidChatSession = ({user}:{user:User}) => {

    const { session } = useSession();

    const [idp, setIdp] = useState<({label:string, value:string}|null)>({ label: identityProviderOptions[0].label, value: identityProviderOptions[0].value });
    const [currentUrl, setCurrentUrl] = useState(window.location.href);
  
    useEffect(() => {
      setCurrentUrl(window.location.href);
    }, [setCurrentUrl]);
  

    return (
        <div>
          <h1>Vecomp Chat</h1>
          {session.info.isLoggedIn ? (
            <>
            <Chat user={user}/>
            <LogoutButton />
            </>
        ) : (
          <>
          Please select your identity provider (idp) and log in to (one of) your Solid Pod(s):
              <Creatable
                options={identityProviderOptions}
                value={idp}
                defaultValue={{ label: identityProviderOptions[0].label, value: identityProviderOptions[0].value }}
                onChange={selection => setIdp(selection)} />
            <LoginButton
                authOptions={{ clientName: "Vecomp Chat" }}
                oidcIssuer={idp == null ? "" : idp.value}
                redirectUrl={currentUrl}
                onError={console.error}
            />
          </>
        )}
        </div>
      );
}
