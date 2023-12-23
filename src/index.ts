import { bool, Canister, ic, int, nat64, Opt, Principal, query, Record, StableBTreeMap, text, update, Vec, Void } from 'azle';
import { generateId, getBalance } from './helpers/helpers';
import { User } from './entities/user';
import { Event } from './entities/events';
import { Orders } from './entities/orders';
import { Confirm } from './entities/confirm';
// This is a global variable that is stored on the heap
let message = '';
/**
 * Create Users
 */

type User = typeof User.tsType;
type Event = typeof Event.tsType;
type Orders = typeof Orders.tsType;
type Confirm = typeof Confirm.tsType;


let users = StableBTreeMap<Principal, User>(0);
let accounts = StableBTreeMap<Principal, nat64>(0);
export default Canister({
    createUser: update([text, text, int, text,text, text, text], User, (full_name, nik, age, username, email, password, notelp) => {
        const id = generateId();
        const user: User = {
            Id: id,
            FullName: full_name,
            Nik: nik,
            Age: age,
            Username: username,
            Email: email,
            Password: password,
            NoTelp: notelp,
            CreatedAt: ic.time(),
        };
        users.insert(user.Id, user);
        return user
    }),
    readUsers: query([], Vec(User), () => {
        return users.values();
    }), 
    readUserById: query([Principal], Opt(User), (id) => {
        return users.get(id);
    }),

    transfer: update([Principal, nat64], nat64, (to, amount) => {
        const from = ic.caller();
        const fromBalance = getBalance(accounts.get(from));
        if (amount > fromBalance) {
            throw new Error(`${from} has an insufficient balance`);
        }
        const toBalance = getBalance(accounts.get(to));
        accounts.insert(from, fromBalance - amount);
        accounts.insert(to, toBalance + amount);
        return amount;
    })
});
