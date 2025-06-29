import { IsDateString, IsInt } from "class-validator";

export class CreateRentalDto {
    @IsInt()
    machineId: number;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;
}