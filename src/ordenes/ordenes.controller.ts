import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdenesService } from './ordenes.service';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { OrderpaginationDto } from './dto/order-pagination.dto';
import { ChangeStatusDto } from './dto';

@Controller()
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @MessagePattern({cmd:'crear-orden'})
  create(@Payload() createOrdeneDto: CreateOrdeneDto) {
    return this.ordenesService.create(createOrdeneDto);
    //console.log(createOrdeneDto)
  }

  @MessagePattern({cmd:'obtener-ordenes'})
  findAll(@Payload() orderPaginationDto : OrderpaginationDto) {
    return this.ordenesService.findAll(orderPaginationDto);
  }

  @MessagePattern({cmd:'obtener-orden-por-id'})
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.ordenesService.findOne(id);
  }

  @MessagePattern({cmd:'cambiar-status-orden'})
  changeOrderStatus(@Payload() changeStatusDto : ChangeStatusDto){ 
    return this.ordenesService.changeStatus(changeStatusDto);
  }


 
}
