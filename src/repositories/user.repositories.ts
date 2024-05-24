import { AppDataSource } from "../config/database.config"
import { User } from "../entities/User";


export const create = async (user: User) => {
    const newUser = new User();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.email = user.email;
    newUser.password = user.password;
    return await AppDataSource.manager.save(newUser);
}

export const findByEmail = async (email: string) => {
    return await AppDataSource.manager.findOne(User
        , { where: { email } });
};

export const findById = async (id: number) => {
    return await AppDataSource.manager.findOne(User
        , { where: { id } });
};

export const findAll = async () => {
    return await AppDataSource.manager.find(User);
};
