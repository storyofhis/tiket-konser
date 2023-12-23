import { bool, Canister, Err, ic, int, nat64, Ok, Opt, Principal, query, Record, Result, StableBTreeMap, text, update, Vec, Void } from 'azle';
import { UserCanisters } from './canisters/users';
import { TicketsCanisters } from './canisters/tickets';
import { EventCanisters } from './canisters/events';

// This is a global variable that is stored on the heap

export default Canister({
    /**
     * User
     */
    createUser: UserCanisters.createUser,
    readUsers: UserCanisters.readUsers,
    readUserById: UserCanisters.readUserById,
    loginUser: UserCanisters.loginUser,

    /**
     * Event
     * input : username & password firtsly
     */
    CreateEvent: EventCanisters.createEvent,
    readEvents: EventCanisters.getEvents,

    /**
     * Ticket
     * input : username & password firtsly
     */
    createTickets: TicketsCanisters.createTicket,
    
});
