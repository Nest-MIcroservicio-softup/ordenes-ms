import { PaginacionDto } from "src/common/dtos";
import { OrdenStatusList } from "../enum/orden.enum";
import { IsEnum, IsOptional } from "class-validator";
import { OrdenStatus } from "@prisma/client";

export class OrderpaginationDto extends PaginacionDto{

    @IsOptional()
    @IsEnum(OrdenStatusList,{
        message: `status must be a valid value ${OrdenStatusList}`
    })
    status :OrdenStatus

}