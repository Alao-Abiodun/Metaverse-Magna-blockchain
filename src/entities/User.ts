import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export interface IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    password: string
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string

}
