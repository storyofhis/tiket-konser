import { Record, int, int16, text } from "azle";


export const NOT_FOUND = "NOT FOUND";
export const UNAUTHORIZE = "UNAUTHORIZED";
export const FORBIDDEN = "FORBIDDEN";
export const BAD_REQUEST = "BAD REQUEST";
export const INTERNAL_SERVER_ERROR = "INTERNAL SERVER ERROR";

export const ERROR = Record({
    code: int16,
    message: text,
});
