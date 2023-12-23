import { Principal, Record, nat64 } from "azle";

export const Tickets = Record({
    Id: Principal,
    Price: nat64,
    EventId: Principal,
    CreateAt: nat64,
});

export const TicketsPayload = Record({
    Price: nat64,
})