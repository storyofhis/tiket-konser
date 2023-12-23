import { Principal, Result, StableBTreeMap, Vec, ic, query, text, update } from "azle";
import { Event, EventPayload } from "../entities/events";
import { BAD_REQUEST, ERROR } from "../entities/base";
import { generateId } from "../helpers/helpers";
import { users } from "./users";

type Event = typeof Event.tsType;
let events = StableBTreeMap<Principal, Event>(0);

type ERROR = typeof ERROR.tsType;

export const EventCanisters = {
    createEvent: update([text, text, EventPayload], Result(Event, ERROR), (username, password, event_payload) => {
        const user = Array.from(users.values()).find(       // login
            u => (u.Username === username || u.Email === username) && u.Password === password
        );

        if (user) {
            const id = generateId();
            const category = event_payload.Category === "0" ? "ROCK" : 
                event_payload.Category === "1" ? "POP" : 
                event_payload.Category === "2" ? "JAZ" : 
                event_payload.Category === "3" ? "ORCHESTRA" : 
                event_payload.Category === "4" ? "DANGDUT" : "NOT FOUND";

            const caller = ic.caller();
            const callerUser = users.get(caller);
            const userRole = callerUser?.Some?.Role;
            const userId = callerUser?.Some?.Id;
            // console.log("User ID : ", user.Id);
            console.log("User ID : ", user.Id.toString().replace(/"/g, ''));

            const event: Event = {
                Id: id,
                UserId: id,     // [ERROR]: this id is not correct should from user_id
                Name: event_payload.Name,
                Date: ic.time(),
                Category: category,
                CreatedAt: ic.time(),
            };

            events.insert(event.Id, event);

            if (userRole === "organizer") {
                const err: ERROR = {
                    code: 403,
                    message: "FORBIDDEN",
                };
                return Result.Err(err);
            }

            return Result.Ok(event);
        } else {
            const err: ERROR = {
                code: 401,
                message: "UNAUTHORIZED",
            };
            return Result.Err(err);
        }
    }),
    
    getEvents: query([text, text], Result(Vec(Event), ERROR), (username, password) => {
        const user = Array.from(users.values()).find(      
            u => (u.Username === username || u.Email === password) && u.Password === password
        );
        if (user) {
            // const eventsForUser = Array.from(events.values()).filter(e => e.UserId === user.Id);
            console.log("Events : ", events.values());
            return Result.Ok(events.values());
        } else {
            const err: ERROR = {
                code: 500,
                message: BAD_REQUEST,
            };
            return Result.Err(err);
        }
    }),
}