import { Body, Controller, Get, Post } from '@nestjs/common';
import { Coupon } from './coupon.entity';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll(): Promise<Coupon[]> {
    return this.couponsService.findAll();
  }

  @Post()
  create(@Body() coupon: Coupon): Promise<Coupon> {
    return this.couponsService.create(coupon);
  }
}
