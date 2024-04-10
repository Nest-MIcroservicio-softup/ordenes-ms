import { OrdenStatus } from "@prisma/client";
import { IsNumber, IsPositive, IsEnum, IsOptional, IsBoolean, IsArray, ArrayMinSize, validate, ValidateNested } from "class-validator";
import { OrdenStatusList } from "../enum/orden.enum";
import { Type } from "class-transformer";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrdeneDto {

    // @IsNumber()
    // @IsPositive()
    // total: number;

    // @IsNumber()
    // @IsPositive()
    // totalItems: number;

    // @IsEnum(OrdenStatusList, {
    //     message: `El estado de la orden debe ser uno de los siguientes valores: ${OrdenStatusList}`
    // })
    // @IsOptional()
    // status: OrdenStatus = OrdenStatus.PENDIENTE

    // @IsOptional()
    // @IsBoolean()
    // pagado: boolean = false;


    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[]



}
