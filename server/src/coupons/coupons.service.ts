import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private CouponsRepository: Repository<Coupon>,
  ) {}

  findAll(query): Promise<Coupon[]> {
    const { take = 10, order = { id: 'DESC' } } = query;
    return this.CouponsRepository.find({
      take,
      order,
    });
  }

  findOne(id: string): Promise<Coupon> {
    return this.CouponsRepository.findOne(id);
  }

  create(coupon: Coupon): Promise<Coupon> {
    return this.CouponsRepository.save(coupon);
  }

  count(query): Promise<number> {
    return this.CouponsRepository.count(query);
  }

  async remove(id: string): Promise<void> {
    await this.CouponsRepository.delete(id);
  }
}
