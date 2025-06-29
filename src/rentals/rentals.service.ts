import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalRequest } from './rental-request.entity/rental-request.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Machine } from 'src/machines/machine.entity/machine.entity';
import { User } from 'src/users/user.entity/user.entity';

@Injectable()
export class RentalsService {

    constructor(
        @InjectRepository(RentalRequest) private rentalRepo: Repository<RentalRequest>,
        @InjectRepository(Machine) private machineRepo: Repository<Machine>,
    ) { }

    async create(dto: CreateRentalDto, user: User): Promise<RentalRequest> {

        const machine = await this.machineRepo.findOneBy({ id: dto.machineId });
        if (!machine) {
            throw new Error(`La maquina ${dto.machineId} no ha sido encontrada`)
        }

        const rental = this.rentalRepo.create({
            startDate: dto.startDate,
            endDate: dto.endDate,
            machine,
            user: { id: user.id } as User,
            status: 'pending',
        });

        console.log("rental create", rental)

        return this.rentalRepo.save(rental);
    }

    async findByUser( userId: number ): Promise<RentalRequest[]> {
        return this.rentalRepo.find({
            where: { user: { id: userId } },
            relations: ['machine', 'user'],
        })
    }

}
