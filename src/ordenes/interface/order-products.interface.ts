import { OrdenStatus } from "@prisma/client";

export interface OrderWithProducts {
    ordenItems: {
        nombre: any;
        productID: number;
        cantidad: number;
        precio: number;
    }[];
    id: string;
    status: OrdenStatus;
    total: number;
    totalItems: number;
    pagado: boolean;
    fechaPago: Date;
    createdAt: Date;
    updatedAt: Date;

}