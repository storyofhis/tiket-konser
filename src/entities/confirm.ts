import { Record, bool, int, text } from "azle";
import { Orders } from "./orders";
import { Bank } from "./bank";
import { User } from "./user";

export const Confirm = Record({
    OrdersId: Orders.Id,
    ToBank: Bank,
    AccountNumber: text,
    FromBank: Bank,
    FromUser: User.FullName,
    Nominal: int,
    Booking_status: bool,
    time_transfered: Orders.CreatedAt,
});