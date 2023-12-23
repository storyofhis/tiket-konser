import { Principal, Record, nat64, text } from "azle";
import { Bank } from "./bank";

export const Event = Record({
    Id: Principal,
    Name: text,
    date: nat64,
    category: text,
    account_number: text,
    bank: Bank,
    createdAt: nat64,
});
