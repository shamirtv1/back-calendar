import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateIncidentDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    notes: string;
    
    @IsDateString()
    start: Date;
    
    @IsDateString()
    end: Date;

}
