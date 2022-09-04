import { Role, User } from "./user";

export class GlobalConstants {
    public static reRoute: any;
    public static guest: User = {
        username: "guest",
        email: "",
        role: Role.GUEST,
        password_hash: "",
        created_at: new Date()
    };
    public static user: User = GlobalConstants.guest;
}