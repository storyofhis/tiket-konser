import { Principal, Record, int, nat64, text } from "azle";

export const User = Record({
    Id: Principal,
    FullName: text,
    Nik: text,
    Age: int,
    Username: text,
    Email: text,
    Password: text,
    NoTelp: text,
    CreatedAt: nat64,
});

export const USER_ROLE = ['ORGANIZER', 'ADMIN'];