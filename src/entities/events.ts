import { Principal, Record, Vec, nat64, text } from "azle";
import { Bank } from "./bank";

export const Event = Record({
    Id: Principal,
    Name: text,
    Date: nat64,
    Category: text,
    // Account_number: text,
    CreatedAt: nat64,
});


// const Category = ["ROCK", "POP", "JAZ", "ORCHESTRA", "DANGDUT"]
export const EventPayload = Record({
    Name: text, 
    Category: text,
})