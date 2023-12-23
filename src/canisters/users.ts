import { Opt, Principal, Result, StableBTreeMap, Vec, ic, query, text, update } from "azle";
import { User, UserPayload } from "../entities/user";
import { BAD_REQUEST, ERROR } from "../entities/base";
import { generateId } from "../helpers/helpers";

type User = typeof User.tsType;
export const users = StableBTreeMap<Principal, User>(0);

type ERROR = typeof ERROR.tsType;

export const UserCanisters = {
    createUser: update([UserPayload], Result(User, ERROR), (user_payload) => {
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
            const err: ERROR = {
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
    loginUser: update([text, text], Result(User, ERROR), (username, password) => {
        const user = Array.from(users.values()).find(
            u => (u.Username === username || u.Email === username) && u.Password === password
        );

        if (user) {
            return Result.Ok(user);
        } else {
            const err: ERROR = {
                code: 500,
                message: BAD_REQUEST,
            };
            return Result.Err(err);
        }
    }),
}