import { Chat } from './Chat';
import { User, Presence, UserStatus } from "@chatscope/use-chat";
import { useState, useEffect } from "react";
import Creatable from 'react-select/creatable';
import { useSession, useThing, useDataset, LoginButton, LogoutButton, CombinedDataProvider, Image, Text } from "@inrupt/solid-ui-react";
import { 
  getStringNoLocale,
  getUrl,
  getSolidDataset,
  getThing } from "@inrupt/solid-client";
import { FOAF, VCARD } from "@inrupt/lit-generated-vocab-common";
import { identityProviderOptions } from './solid-identityproviders';

export const SolidChatSession = () => {

    const { session } = useSession();
    const webId = session.info.webId!;

    const [idp, setIdp] = useState<({label:string, value:string}|null)>({ label: identityProviderOptions[0].label, value: identityProviderOptions[0].value });
    const [currentUrl, setCurrentUrl] = useState(window.location.href);
  
    useEffect(() => {
      setCurrentUrl(window.location.href);
    }, [setCurrentUrl]);
   
    const [ user, setUser ] = useState(new User({
      id: webId,
      presence: new Presence({status: UserStatus.Available, description: ""}),
      firstName: "",
      lastName: "",
      username: "- retrieving user name -",
      email: "",
      avatar: "",
      bio: ""
    }));

    const [ solidUserLoaded, setSolidUserLoaded] = useState(false);

    if (session.info.isLoggedIn) {
      if (!solidUserLoaded) {
        setSolidUserLoaded(true);
        console.log("##### Fetching user data from Solid");
        getSolidDataset(webId, { fetch: session.fetch } ).then((profile) => {
          const profileThing = getThing(profile, webId)!;
          const firstName = getStringNoLocale(profileThing!, FOAF.givenName.iriAsString) as string
          const username = firstName;
          const lastName = getStringNoLocale(profileThing!, FOAF.familyName.iriAsString) as string
          const avatar = getUrl(profileThing!, VCARD.hasPhoto.iriAsString) as string
          const loadedUser = new User({
            id: user.id,
            presence: user.presence,
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: user.email,
            avatar: avatar,
            bio: user.bio
          });
          setUser(loadedUser);
        });
      }
    }

    return (
        <>
          <h1>Vecomp Chat</h1>
          {session.info.isLoggedIn ? (
            <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
            <Chat user={user}/>
            <LogoutButton />
            </CombinedDataProvider>
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
                oidcIssuer={idp == null ? identityProviderOptions[0].value : idp.value}
                redirectUrl={currentUrl}
                onError={console.error}
            />
          </>
        )}
        </>
      );
}
