import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { UsersModule } from 'src/users/users.module';
import { MachinesModule } from 'src/machines/machines.module';
import { Machine } from 'src/machines/machine.entity/machine.entity';
import { RentalRequest } from './rental-request.entity/rental-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature( [RentalRequest, Machine] ),
    UsersModule,
    MachinesModule,
  ],
  controllers: [RentalsController],
  providers: [RentalsService]
})
export class RentalsModule {}
