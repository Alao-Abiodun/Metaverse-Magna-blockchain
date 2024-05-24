import { Container, Inject, Service } from 'typedi';
import { UserRepository } from "../repositories/user.repository";
import AppError from '../utils/lib/appError';
import { comparePassword } from '../utils/helpers/bcrypt.helper';


@Service()
export class UserService {

    constructor(
        private userService: UserRepository = Container.get(UserRepository)
    ) { }

    public async createUser(data) {
        const { firstName, lastName, email, password } = data

        const userExists = await this.userService.findByEmail(email);

        if (userExists) {
            return new AppError('User already exists', 400);
        }

        const newUser = await this.userService.create({
            id: 0,
            firstName,
            lastName,
            email,
            password
        
        });

        return newUser;
    }

    public async login(data) {
        const { email, password } = data;
        const user = await this.userService.findByEmail(email);

        if (!user) {
            return new AppError('Invalid credentials', 401);
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return new AppError('Invalid credentials', 401);
        }
        
        return user;
    }
}