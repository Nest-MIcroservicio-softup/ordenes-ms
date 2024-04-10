import { Module } from '@nestjs/common';
import { OrdenesModule } from './ordenes/ordenes.module';

@Module({
  imports: [OrdenesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
