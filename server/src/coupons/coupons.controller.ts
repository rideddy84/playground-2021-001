import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Coupon } from './coupon.entity';
import { CouponsService } from './coupons.service';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';

@Controller('coupons')
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
    @InjectQueue('coupon')
    private readonly couponQueue: Queue,
  ) {}

  @Get()
  findAll(@Query() query): Promise<Coupon[]> {
    const { skip, take, type } = query;
    return this.couponsService.findAll({
      skip,
      take,
      ...(type && {
        where: {
          type,
        },
      }),
    });
  }

  @Get('count')
  count(@Query() query): Promise<number> {
    const { type } = query;
    return this.couponsService.count({
      ...(type && {
        where: {
          type,
        },
      }),
    });
  }

  @Post()
  create(@Body() coupon: Coupon): Promise<Coupon> {
    return this.couponsService.create(coupon);
  }

  @Post('generate')
  generate(@Body() coupon: Coupon): Promise<Bull.Job<any>> {
    return this.couponQueue.add('generate', coupon);
  }
}
