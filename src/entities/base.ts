import { Record, text } from "azle";

export const Error = Record({
    NOT_FOUND: text,
    UNAUTHORIZE: text,
    FORBIDDEN: text,
    BAD_REQUEST: text,
    INTERNAL_SERVER_ERROR: text,
});
