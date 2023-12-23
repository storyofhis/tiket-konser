import { Opt, Principal, nat64 } from "azle"

export  function generateId(): Principal{
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));
    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}

export function getBalance(accountOpt: Opt<nat64>): nat64 {
    if ('None' in accountOpt) {
        return 0n;
    }
    return accountOpt.Some;
}