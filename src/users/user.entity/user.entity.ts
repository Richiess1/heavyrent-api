import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Machine } from "src/machines/machine.entity/machine.entity";
import { RentalRequest } from "src/rentals/rental-request.entity/rental-request.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: 'customer' })
    role: string;

    @OneToMany( () => Machine, machine => machine.createdBy)
    machines: Machine[];

    @OneToMany( () => RentalRequest, rental => rental.user)
    rentals: RentalRequest[];
}