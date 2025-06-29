import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MachinesModule } from './machines/machines.module';
import { RentalsModule } from './rentals/rentals.module';
import { User } from './users/user.entity/user.entity';
import { Machine } from './machines/machine.entity/machine.entity';
import { RentalRequest } from './rentals/rental-request.entity/rental-request.entity';
import 'dotenv/config';

console.log( "ver archivo env", process.env.DB_USERNAME );

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [ User, Machine, RentalRequest ],
      synchronize: true,
    }),
    AuthModule, 
    UsersModule, 
    MachinesModule, 
    RentalsModule
  ],
})
export class AppModule {}
