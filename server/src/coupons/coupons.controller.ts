import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Coupon } from './coupon.entity';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll(@Query() query): Promise<Coupon[]> {
    return this.couponsService.findAll(query);
  }

  @Get('count')
  count(@Query() query): Promise<number> {
    return this.couponsService.count(query);
  }

  @Post()
  create(@Body() coupon: Coupon): Promise<Coupon> {
    return this.couponsService.create(coupon);
  }
}
