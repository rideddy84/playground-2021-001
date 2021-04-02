import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { Coupon } from './coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])],
  providers: [CouponsService],
  controllers: [CouponsController],
})
export class CouponsModule {}