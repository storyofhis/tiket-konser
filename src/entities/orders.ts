import { Principal, Record, int, nat64, text } from "azle";
import { User } from "./user";
import { Event } from "./events";

export const Orders = Record({
    Id: Principal,
    UserId: User.Id,
    EventId: Event.Id,
    Status: text,
    festival_tikets: int,
    vip: int,
    times_buy: nat64,
    CreatedAt: nat64,
});