import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Coupon } from './coupon.entity';
import { CouponsService } from './coupons.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('coupons')
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
    @InjectQueue('coupon')
    private readonly couponQueue: Queue,
  ) {}

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

  @Post('generate')
  async generate(@Body() coupon: Coupon) {
    await this.couponQueue.add('generate', coupon);
  }
}
