import { Chat } from './Chat';
import { User } from "@chatscope/use-chat";
import { useState, useEffect } from "react";
import { useSession, LoginButton, LogoutButton } from "@inrupt/solid-ui-react";

export const SolidChatSession = ({user}:{user:User}) => {

    const { session } = useSession();

    const [idp, setIdp] = useState("https://login.inrupt.com");
    const [currentUrl, setCurrentUrl] = useState("https://localhost:3000");
  
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
            <LoginButton
                authOptions={{ clientName: "Vecomp Chat" }}
                oidcIssuer={idp}
                redirectUrl={currentUrl}
                onError={console.error}
            />
        )}
        </div>
      );
}
