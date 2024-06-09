import { User, UserParams } from "@chatscope/use-chat";

export type SolidChatUserParams = UserParams & {
    location?: string;
    age?: number;
};

export class SolidChatUser extends User {
    location: string;
    age: number;
    constructor({ id, presence, firstName, lastName, username, email, avatar, bio, location = "", age = 0 }: SolidChatUserParams) {
        super({ id, presence, firstName, lastName, username, email, avatar, bio });
        this.location = location;
        this.age = age;
    }
}
