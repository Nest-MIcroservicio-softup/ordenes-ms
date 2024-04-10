import { IsNumber, IsPositive } from "class-validator";

export class OrderItemDto {
    @IsNumber()
    @IsPositive()
    cantidad: number;

    @IsNumber()
    @IsPositive()
    precio: number;

    @IsNumber()
    @IsPositive()
    productoId: number;
}