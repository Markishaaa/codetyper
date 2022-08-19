export interface User {
    username: string;
    email: string;
    role: Role;
    password_hash: string;
    created_at: Date;
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}