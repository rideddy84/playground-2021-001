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

  findAll(): Promise<Coupon[]> {
    return this.CouponsRepository.find();
  }

  findOne(id: string): Promise<Coupon> {
    return this.CouponsRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.CouponsRepository.delete(id);
  }
}