import { OrdenStatus } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";
import { OrdenStatusList } from "../enum/orden.enum";

export class ChangeStatusDto {
    
    @IsUUID()
    id:string
    
    @IsEnum(OrdenStatusList,{message: `status must be a valid value ${OrdenStatusList}`})
    status: OrdenStatus
}