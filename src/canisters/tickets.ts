import { Principal, Result, StableBTreeMap, ic, text, update } from "azle";
import { Tickets, TicketsPayload } from "../entities/tickets";
import { ERROR } from "../entities/base";
import { users } from "./users";
import { generateId } from "../helpers/helpers";

type Tickets = typeof Tickets.tsType;
let tickets = StableBTreeMap<Principal, Tickets>(0); 

type ERROR = typeof ERROR.tsType;

export const TicketsCanisters = {
    createTicket: update([text, text, TicketsPayload], Result(Tickets, ERROR), (username, password, tickets_payload) => {
        const user = Array.from(users.values()).find(
            u => (u.Username === username || u.Email === username) && u.Password === password
        );
    
        if (user) {
            const id = generateId();
            const caller = ic.caller();
            
            const ticket: Tickets = {
                Id: id,
                Price: tickets_payload.Price,
                EventId: id, // Update this based on your system logic to associate tickets with an event
                CreateAt: ic.time(),
            };
    
            // Save tickets or perform relevant operations here
            tickets.insert(ticket.Id, ticket);
            return Result.Ok(ticket);
        } else {
            const err: ERROR = {
                code: 401,
                message: "UNAUTHORIZED",
            };
            return Result.Err(err);
        }
    })
}