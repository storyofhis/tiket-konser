import { bool, Canister, Err, ic, int, nat64, Ok, Opt, Principal, query, Record, Result, StableBTreeMap, text, update, Vec, Void } from 'azle';
import { generateId, getBalance } from './helpers/helpers';
import { User, UserPayload } from './entities/user';
import { Event, EventPayload } from './entities/events';
import { Orders } from './entities/orders';
import { Confirm } from './entities/confirm';
import { BAD_REQUEST, Error, FORBIDDEN } from './entities/base';
import { Tickets, TicketsPayload } from './entities/tickets';
// This is a global variable that is stored on the heap
let message = '';
/**
 * Create Users
 */

type User = typeof User.tsType;
type Event = typeof Event.tsType;
type Orders = typeof Orders.tsType;
type Confirm = typeof Confirm.tsType;
type Tickets = typeof Tickets.tsType;

type Error = typeof Error.tsType;

let users = StableBTreeMap<Principal, User>(0);
let events = StableBTreeMap<Principal, Event>(0);
let tickets = StableBTreeMap<Principal, Tickets>(0); 
let accounts = StableBTreeMap<Principal, nat64>(0);

export default Canister({
    createUser: update([UserPayload], Result(User, Error), (user_payload) => {
        const caller = ic.caller();
        if (users.containsKey(caller) 
            // Array.from(users.values()).find(             //[ERROR]!! 
            //     user => 
            //     user.Nik === user_payload.Nik ||
            //     user.FullName === user_payload.FullName || 
            //     user.Email === user_payload.Email || 
            //     user.Username === user_payload.Username || 
            //     user.Password === user_payload.Password
            // ) 
        ) {
            const err: Error = {
                code: 500,
                message: BAD_REQUEST,
            };
            return Result.Err(err);
        }
        const id = generateId();
        const role = user_payload.Role === "0" ? "participants" : "organizer";

        const user: User = {
            Id: id,
            FullName: user_payload.FullName,
            Nik: user_payload.Nik,
            Age: user_payload.Age,
            Username: user_payload.Username,
            Email: user_payload.Email,
            Password: user_payload.Password,
            NoTelp: user_payload.NoTelp,
            Role: role,
            CreatedAt: ic.time(),
        };
        users.insert(user.Id, user);
        return Result.Ok(user)
    }),
    readUsers: query([], Vec(User), () => {     // [ERROR]!!
        return users.values();
    }), 
    readUserById: query([Principal], Opt(User), (id) => {
        return users.get(id);
    }),
    // transfer: update([Principal, nat64], nat64, (to, amount) => {
    //     const from = ic.caller();
    //     const fromBalance = getBalance(accounts.get(from));
    //     if (amount > fromBalance) {
    //         throw new Error(`${from} has an insufficient balance`);
    //     }
    //     const toBalance = getBalance(accounts.get(to));
    //     accounts.insert(from, fromBalance - amount);
    //     accounts.insert(to, toBalance + amount);
    //     return amount;
    // })
    loginUser: update([text, text], Result(User, Error), (username, password) => {
        const user = Array.from(users.values()).find(
            u => (u.Username === username || u.Email === username) && u.Password === password
        );

        if (user) {
            return Result.Ok(user);
        } else {
            const err: Error = {
                code: 500,
                message: BAD_REQUEST,
            };
            return Result.Err(err);
        }
    }),

    /**
     * Event
     * input : username & password firtsly
     */

    createEvent: update([text, text, EventPayload], Result(Event, Error), (username, password, event_payload) => {
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
                const err: Error = {
                    code: 403,
                    message: "FORBIDDEN",
                };
                return Result.Err(err);
            }

            return Result.Ok(event);
        } else {
            const err: Error = {
                code: 401,
                message: "UNAUTHORIZED",
            };
            return Result.Err(err);
        }
    }),
    
    getEvents: query([text, text], Result(Vec(Event), Error), (username, password) => {
        const user = Array.from(users.values()).find(      
            u => (u.Username === username || u.Email === password) && u.Password === password
        );
        if (user) {
            // const eventsForUser = Array.from(events.values()).filter(e => e.UserId === user.Id);
            console.log("Events : ", events.values());
            return Result.Ok(events.values());
        } else {
            const err: Error = {
                code: 500,
                message: BAD_REQUEST,
            };
            return Result.Err(err);
        }
    }),

    /**
     * Ticket
     * input : username & password firtsly
     */
    createTicket: update([text, text, TicketsPayload], Result(Tickets, Error), (username, password, tickets_payload) => {
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
            const err: Error = {
                code: 401,
                message: "UNAUTHORIZED",
            };
            return Result.Err(err);
        }
    })
    
});
