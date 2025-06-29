import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/users/user.entity/user.entity";
import { Machine } from "src/machines/machine.entity/machine.entity";

@Entity()
export class RentalRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @Column({ default: 'pending' })
    status: string;

    @ManyToOne(() => User, user => user.rentals, { eager: false })
    @JoinColumn( { name: 'userId' } )
    user: User;

    @ManyToOne(() => Machine, machine => machine.rentals, { eager: false })
    @JoinColumn( { name: 'machineId' } )
    machine: Machine;
}
