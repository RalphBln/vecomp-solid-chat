import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    BasicStorage,
    ChatMessage,
    ChatProvider,
    Conversation,
    ConversationId,
    ConversationRole,
    IStorage,
    MessageContentType,
    Participant,
    Presence,
    TypingUsersList,
    UpdateState,
    UserStatus
} from "@chatscope/use-chat";
import {ExampleChatService} from "@chatscope/use-chat/dist/examples";
import {nanoid} from "nanoid";
import {Col, Container, Row} from "react-bootstrap";
import {akaneModel, eliotModel, emilyModel, joeModel, users} from "./data/data";
import {AutoDraft} from "@chatscope/use-chat/dist/enums/AutoDraft";
import {Footer} from "./components/Footer";
import {SessionProvider} from "@inrupt/solid-ui-react";
import {SolidChatSession} from "./components/SolidChatSession";
import {SolidChatUser} from "./SolidChatUser";

// sendMessage and addMessage methods can automagically generate id for messages and groups
// This allows you to omit doing this manually, but you need to provide a message generator
// The message id generator is a function that receives message and returns id for this message
// The group id generator is a function that returns string
const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
const groupIdGenerator = () => nanoid();

const akaneStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
const eliotStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
const emilyStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
const joeStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});

// Create serviceFactory
const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ExampleChatService(storage, updateState);
};

const akane = new SolidChatUser({
    id: akaneModel.name,
    presence: new Presence({status: UserStatus.Available, description: ""}),
    firstName: "",
    lastName: "",
    username: akaneModel.name,
    email: "",
    avatar: akaneModel.avatar,
    bio: "",
    location: akaneModel.location,
    age: akaneModel.age
});

const emily = new SolidChatUser({
    id: emilyModel.name,
    presence: new Presence({status: UserStatus.Available, description: ""}),
    firstName: "",
    lastName: "",
    username: emilyModel.name,
    email: "",
    avatar: emilyModel.avatar,
    bio: "",
    location: emilyModel.location,
    age: emilyModel.age
});

const eliot = new SolidChatUser({
    id: eliotModel.name,
    presence: new Presence({status: UserStatus.Available, description: ""}),
    firstName: "",
    lastName: "",
    username: eliotModel.name,
    email: "",
    avatar: eliotModel.avatar,
    bio: "",
    location: eliotModel.location,
    age: eliotModel.age
});

const joe = new SolidChatUser({
    id: joeModel.name,
    presence: new Presence({status: UserStatus.Available, description: ""}),
    firstName: "",
    lastName: "",
    username: joeModel.name,
    email: "",
    avatar: joeModel.avatar,
    bio: "",
    location: joeModel.location,
    age: joeModel.age
});

const chats = [
    {name: "Akane", storage: akaneStorage},
    {name: "Eliot", storage: eliotStorage},
    {name: "Emily", storage: emilyStorage},
    {name: "Joe", storage: joeStorage}
];

function createConversation(id: ConversationId, name: string): Conversation {
    return new Conversation({
        id,
        participants: [
            new Participant({
                id: name,
                role: new ConversationRole([])
            })
        ],
        unreadCounter: 0,
        typingUsers: new TypingUsersList({items: []}),
        draft: ""
    });
}


// Add users and conversations to the states
chats.forEach(c => {

    users.forEach(u => {
        if (u.name !== c.name) {
            c.storage.addUser(new SolidChatUser({
                id: u.name,
                presence: new Presence({status: UserStatus.Available, description: ""}),
                firstName: "",
                lastName: "",
                username: u.name,
                email: "",
                avatar: u.avatar,
                bio: "",
                location: u.location,
                age: u.age
            }));

            const conversationId = nanoid();

            const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
            if (!myConversation) {

                c.storage.addConversation(createConversation(conversationId, u.name));

                const chat = chats.find(chat => chat.name === u.name);

                if (chat) {

                    const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
                    if (!hisConversation) {
                        chat.storage.addConversation(createConversation(conversationId, c.name));
                    }

                }

            }

        }
    });

});

function App() {

    return (
        <SessionProvider>
        <div className="h-100 d-flex flex-column overflow-hidden">
                        <ChatProvider serviceFactory={serviceFactory} storage={akaneStorage} config={{
                            typingThrottleTime: 250,
                            typingDebounceTime: 900,
                            debounceTyping: true,
                            autoDraft: AutoDraft.Save | AutoDraft.Restore
                        }}>
                            <SolidChatSession />
                        </ChatProvider>
        </div>
        </SessionProvider>
    );
}

export default App;

