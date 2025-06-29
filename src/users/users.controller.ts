import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersServive: UsersService) { }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersServive.findById(Number(id));
    }
}
