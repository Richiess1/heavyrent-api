import { IsNotEmpty, IsString, MinLength, IsNumber } from "class-validator";

export class CreateMachineDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(10)
    description: string;

    @IsNotEmpty()
    @IsNumber()
    pricePerDay: number;
}