import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './machine.entity/machine.entity';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MachinesService {

    constructor(
        @InjectRepository(Machine)
        private repo: Repository<Machine>,
        private usersService: UsersService,
    ) {}

    async create(dto: CreateMachineDto, jwtPayload: { userId: number }) : Promise<Machine> {

        const user = await this.usersService.findById( jwtPayload.userId );

        if (!user) {
            throw new Error('usuario no encontrado');
        }

        const machine = this.repo.create({
            name: dto.name,
            description: dto.description,
            createdBy: user,
            available: true
        });

        return this.repo.save(machine);

    }

    findAll(): Promise<Machine[]> {
        return this.repo.find({ relations: ['createdBy'] });
    }

}
