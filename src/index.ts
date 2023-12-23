import { bool, Canister, Err, ic, int, nat64, Ok, Opt, Principal, query, Record, Result, StableBTreeMap, text, update, Vec, Void } from 'azle';
import { generateId, getBalance } from './helpers/helpers';
import { User, UserPayload } from './entities/user';
import { Event, EventPayload } from './entities/events';
import { Orders } from './entities/orders';
import { Confirm } from './entities/confirm';
import { BAD_REQUEST, Error, FORBIDDEN } from './entities/base';
// This is a global variable that is stored on the heap
let message = '';
/**
 * Create Users
 */

type User = typeof User.tsType;
type Event = typeof Event.tsType;
type Orders = typeof Orders.tsType;
type Confirm = typeof Confirm.tsType;

type Error = typeof Error.tsType;

let users = StableBTreeMap<Principal, User>(0);
let events = StableBTreeMap<Principal, Event>(0);
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
     * Create Event
     */

    createEvent: query([text, text, EventPayload], Result(Event, Error), (username, password, event_payload) => {
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

            const event: Event = {
                Id: id,
                Name: event_payload.Name,
                Date: ic.time(),
                Category: category,
                CreatedAt: ic.time(),
            };

            events.insert(event.Id, event);

            const caller = ic.caller();
            const callerUser = users.get(caller);
            const userRole = callerUser?.Some?.Role;

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
});
