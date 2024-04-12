import { HttpStatus, Inject, Injectable, Logger, OnModuleInit, PreconditionFailedException } from '@nestjs/common';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderpaginationDto } from './dto/order-pagination.dto';
import { ChangeStatusDto, PaidOrderDto } from './dto';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { OrderWithProducts } from './interface/order-products.interface';

@Injectable()
export class OrdenesService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(OrdenesService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado a la base de datos');
  }
  async create(createOrdenDto: CreateOrdeneDto) {

    try {

      //Confirmar los ids de los productos
      const productosIds = createOrdenDto.items.map(item => item.productoId);
      const productos: any[] = await firstValueFrom(
        this.client.send({ cmd: 'validar-producto' }, productosIds)
      );

      // Calcular los valores de la orden
      const montoTotal = createOrdenDto.items.reduce((acc, item) => {
        const precio = productos.find(producto => producto.id === item.productoId).precio;
        return precio * item.cantidad
      }, 0);

      const totalItems = createOrdenDto.items.reduce((acc, item) => {
        return acc + item.cantidad
      }, 0)

      //Crear transaccion de base de datos
      const orden = await this.orden.create({
        data: {
          total: montoTotal,
          totalItems: totalItems,
          ordenItems: {
            createMany: {
              data: createOrdenDto.items.map((item) => ({
                cantidad: item.cantidad,
                productID: item.productoId,
                precio: productos.find(producto => producto.id === item.productoId).precio
              }))
            }
          }
        },
        include: {
          ordenItems: {
            select: {
              cantidad: true,
              precio: true,
              productID: true
            }
          }
        }
      });

      return {
        ...orden,
        ordenItems: orden.ordenItems.map(item => ({
          ...item,
          nombre: productos.find(producto => producto.id === item.productID).nombre
        }))
      }

    } catch (error) {
      throw new RpcException({
        message: 'Por favor chequear logs',
        status: HttpStatus.BAD_REQUEST
      })
    }


  }

  async findAll(orderPaginationDto: OrderpaginationDto) {

    const totalPaginas = await this.orden.count({
      where: {
        status: orderPaginationDto.status
      }
    });

    const paginaActual = orderPaginationDto.pagina
    const porPagina = orderPaginationDto.limite

    return {
      data: await this.orden.findMany({
        where: {
          status: orderPaginationDto.status
        },
        take: porPagina,
        skip: (paginaActual - 1) * porPagina
      }),
      meta: {
        total: totalPaginas,
        pagina: paginaActual,
        ultimaPagina: Math.ceil(totalPaginas / porPagina)
      }
    }
  }

  async findOne(id: string) {
    const orden = await this.orden.findUnique({
      where: { id },
      include: {
        ordenItems: {
          select: {
            cantidad: true,
            precio: true,
            productID: true
          }
        }
      }
    })

    if (!orden) {
      throw new RpcException({
        message: `Orden con el id ${id} no encontrado`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    const productosIds = orden.ordenItems.map(item => item.productID);
    const productos: any[] = await firstValueFrom(
      this.client.send({ cmd: 'validar-producto' }, productosIds)
    );

    return {
      ...orden,
      ordenItems: orden.ordenItems.map(item => ({
        ...item,
        nombre: productos.find(producto => producto.id === item.productID).nombre
      }))
    }



  }

  async changeStatus(changeStatusDto: ChangeStatusDto) {
    const { id, status } = changeStatusDto;

    const orden = await this.orden.findUnique({
      where: { id }
    });

    if (!orden) {
      throw new RpcException({
        message: `Orden con el id ${id} no encontrado`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    if (orden.status === status) {
      return orden;
    }

    return this.orden.update({
      where: { id },
      data: { status }
    });
  }

  async createPaymentSession(order: OrderWithProducts) {

    const paymentSession = await firstValueFrom(
      this.client.send('crear.sesion.pago', {
        idOrden: order.id,
        moneda: 'mxn',
        items: order.ordenItems.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio
        }))
      })
    );

    return paymentSession;
  }

  async paidOrder(paidOrderDto: PaidOrderDto) {
    this.logger.log('Pago exitoso');
    this.logger.log(paidOrderDto);

    const orden = await this.orden.update({
      where: { id: paidOrderDto.orderId },
      data: {
        status: 'PAGADO',
        pagado: true,
        fechaPago: new Date(),
        stripeId: paidOrderDto.stripePaymentId,

        ReciboPago: {
          create: {
            reciboUrl : paidOrderDto.receiptUrl,
          }
        }
      }
    });

    return orden;


  }

}
