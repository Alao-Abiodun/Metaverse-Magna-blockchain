import { IUser } from "../../entities/User";

export const removePasswordFromObject = (user: IUser) => {
    const { password, ...rest } = user;
    return rest;
};
