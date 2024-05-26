import { Service } from 'typedi';
import { AppDataSource } from '../config/database.config';

import { User } from "../entities/User";

@Service()
export class UserRepository {

    public async create(user: User) {
        const newUser = AppDataSource.manager.create(User, {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
        });
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



