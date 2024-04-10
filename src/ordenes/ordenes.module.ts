import { Module } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE, PRODUCT_SERVICE, envs } from 'src/config';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrdenesController],
  providers: [OrdenesService],
  imports: [
    NatsModule
  ],
})
export class OrdenesModule {}
