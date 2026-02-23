import { Module } from '@nestjs/common';
import { PaypackService } from './paypack.service';
import { PaypackController } from './paypack.controller';

@Module({
  controllers: [PaypackController],
  providers: [PaypackService],
  exports: [PaypackService],
})
export class PaypackModule {}
