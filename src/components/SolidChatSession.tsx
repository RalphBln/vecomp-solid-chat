import { Chat } from './Chat';
import { Presence, UserStatus } from "@chatscope/use-chat";
import { useState, useEffect } from "react";
import Creatable from 'react-select/creatable';
import { useSession, LoginButton, LogoutButton, CombinedDataProvider } from "@inrupt/solid-ui-react";
import { 
  getStringNoLocale,
  setStringNoLocale,
  getUrl,
  setUrl,
  getSolidDataset,
  saveSolidDatasetAt,
  getThing,
  setThing,
  Thing,
  SolidDataset } from "@inrupt/solid-client";
import { FOAF, VCARD } from "@inrupt/lit-generated-vocab-common";
import { identityProviderOptions } from './solid-identityproviders';
import { SolidChatUser } from '../SolidChatUser';
import Snackbar from '@mui/material/Snackbar';
import { UserDataEntry } from './UserDataEntry';

export const SolidChatSession = () => {

    const { session } = useSession();
    const webId = session.info.webId!;

    const [idp, setIdp] = useState<({label:string, value:string}|null)>({ label: identityProviderOptions[0].label, value: identityProviderOptions[0].value });
    const [currentUrl, setCurrentUrl] = useState(window.location.href.substring(0, window.location.href.indexOf("?")) || window.location.href);
  
    useEffect(() => {
      setCurrentUrl(window.location.href.substring(0, window.location.href.indexOf("?")) || window.location.href);
    }, [setCurrentUrl]);
   
    const [ user, setUser ] = useState(new SolidChatUser ({
      id: webId,
      presence: new Presence({status: UserStatus.Available, description: ""}),
      firstName: "",
      lastName: "",
      username: "- retrieving user name -",
      email: "",
      avatar: "",
      bio: "",
      location: "",
      age: 0
    }));

    const [solidProfile, setSolidProfile] = useState<Thing>();
    const [dataset, setDataset] = useState<SolidDataset>();
    const [solidUserLoaded, setSolidUserLoaded] = useState(false);
    const [dataMissingDialogOpen, setDataMissingDialogOpen] = useState(false);

    if (session.info.isLoggedIn) {  
      if (!solidUserLoaded) {
        setSolidUserLoaded(true);
        console.log("##### Fetching user data from Solid");
        getSolidDataset(webId, { fetch: session.fetch } ).then((profileDataset) => {
          const profileThing = getThing(profileDataset, webId);
          setDataset(profileDataset);
          setSolidProfile(profileThing!);
          const firstName = getStringNoLocale(profileThing!, FOAF.givenName.iriAsString) as string;
          const username = firstName;
          const lastName = getStringNoLocale(profileThing!, FOAF.familyName.iriAsString) as string;
          const avatar = getUrl(profileThing!, VCARD.hasPhoto.iriAsString) as string;
          const location = getStringNoLocale(profileThing!, VCARD.hasCountryName.iriAsString) as string;
          const age = Number(getStringNoLocale(profileThing!, FOAF.age.iriAsString) as string);

          const loadedUser = new SolidChatUser({
            id: user.id,
            presence: user.presence,
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: user.email,
            avatar: avatar,
            bio: user.bio,
            location: location,
            age: age
          });

          setUser(loadedUser);
          console.log("### avatar=" + avatar)

          if (!(firstName && avatar && location && age)) {
            setDataMissingDialogOpen(true);
          }
        });
      }
    }

    const userDataEntered = () => {
      console.log("### User update: " + user.firstName);
      setDataMissingDialogOpen(false);

      var updatedProfileThing = setStringNoLocale(solidProfile!, FOAF.givenName.iriAsString, user.firstName);
      updatedProfileThing = setStringNoLocale(updatedProfileThing!, FOAF.age.iriAsString, user.age.toString());
      updatedProfileThing = setStringNoLocale(updatedProfileThing!, VCARD.hasCountryName.iriAsString, user.location);
      updatedProfileThing = setUrl(updatedProfileThing!, VCARD.hasPhoto.iriAsString, user.avatar);
      storeToSolidPod(updatedProfileThing);
    };

    const updateLocation = async (location: string) => {
      if (location !== user.location) {
        user.location = location;
        storeToSolidPod(setStringNoLocale(solidProfile!, VCARD.hasCountryName.iriAsString, location));
      }
    };

    const [wrongUserDataMessage, setWrongUserDataErrorMessage] = useState("");
    const [wrongUserDataMessageVisible, setWrongUserDataErrorMessageVisible] = useState(false);

    const wrongAgeMessage = "Age must be a number.";
    const checkAge = (age: string) => {
      if (isNaN(Number(age))) {
        setWrongUserDataErrorMessage(wrongAgeMessage);
        setWrongUserDataErrorMessageVisible(true);
        throw(wrongAgeMessage);
      }
    }
    
    const updateAge = async (age: string) => {
      const newAge = Number(age);
      if (newAge !== user.age) {
        user.age = newAge;
        storeToSolidPod(setStringNoLocale(solidProfile!, FOAF.age.iriAsString, age));
      }
    };

    const storeToSolidPod = async (profile: Thing) => {
      setSolidProfile(profile);
      const updatedDataset = setThing(dataset!, profile);
      console.log(`##### Sending updates to Solid Pod ${updatedDataset}`);
      saveSolidDatasetAt(webId, updatedDataset, {fetch: session.fetch}).then(
        (savedDataset) => setDataset(savedDataset),
        (reason) => console.log(`Error on saving changes to Solid Pod: ${reason}`)
      );
    };

    return (
        <>
          <h1>Vecomp Chat</h1>
          {session.info.isLoggedIn ? (
            <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
              <Chat
                user={user}
                updateLocation={updateLocation}
                updateAge={updateAge}
                checkAge={checkAge}
                checkLocation={(location) => {}}
              />
              <div>Logged in as: {user.firstName}&nbsp;<LogoutButton /></div>
              <Snackbar
                message={wrongUserDataMessage}
                open={wrongUserDataMessageVisible}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                onClose={() => { setWrongUserDataErrorMessageVisible(false) }}
              />
              <UserDataEntry
                open={dataMissingDialogOpen}
                user={user}
                dialogClosed={userDataEntered}
              />
            </CombinedDataProvider>
        ) : (
          <div>
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
                onError={ (error) => { console.log(error)}}
            />
            <div>
            <p/>
            <p>
              <a
                target={"getSolidPod"}
                href={"https://solidcommunity.net/register"}>Don't have a Solid Pod yet?</a>
              </p>
            </div>
          </div>
        )}
        <br/>
        Redirect URL: {currentUrl}<br/>
        Session: {session.info.sessionId}<br/>
        WebId: {session.info.webId}<br/>
        </>
      );
}
