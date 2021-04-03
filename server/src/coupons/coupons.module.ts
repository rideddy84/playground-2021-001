import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { Coupon } from './coupon.entity';
import { BullModule } from '@nestjs/bull';
import { CouponProcessor } from './coupons.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon]),
    BullModule.registerQueue({
      name: 'coupon',
    }),
  ],
  providers: [CouponsService, CouponProcessor],
  controllers: [CouponsController],
})
export class CouponsModule {}
