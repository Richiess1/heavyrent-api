import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // Encontrar el usuario por email o de lo contrario lo va a crear
    async findOrCreate(data: { email: string; name: string }): Promise<User> {        
        let user = await this.userRepository.findOne({ where: { email: data.email } });
 
        if (!user) {
            user = this.userRepository.create(data);
            await this.userRepository.save(user);
        }
        return user;
    }

    //buscar por ID
    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    //obtener todos los usuarios
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}
