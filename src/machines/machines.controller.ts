import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('machines')
@ApiBearerAuth()
@Controller('machines')
export class MachinesController {

    constructor(
        private readonly machinesService: MachinesService
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() dto: CreateMachineDto, @Req() req) {
        return this.machinesService.create(dto, req.user);
    }

    @Get()
    findAll(){
        return this.machinesService.findAll();
    }

}
