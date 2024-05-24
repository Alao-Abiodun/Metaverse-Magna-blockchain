import { Service } from 'typedi';
import { AppDataSource } from '../config/database.config';

import { User } from "../entities/User";

@Service()
export class UserRepository {

    public async create(user: User) {
        const newUser = new User();
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.email = user.email;
        newUser.password = user.password;
        return await AppDataSource.manager.save(newUser);
    }

    public async findByEmail(email: string) {
        return await AppDataSource.manager.findOne(User
            , { where: { email } });
    }

    public async findById(id: number) {
        return await AppDataSource.manager.findOne(User
            , { where: { id } });
    }

    public async findAll() {
        return await AppDataSource.manager.find(User);
    }
}



