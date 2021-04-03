import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CouponsService } from './coupons.service';

@Processor('coupon')
export class CouponProcessor {
  private readonly logger = new Logger(CouponProcessor.name);
  constructor(private readonly couponsService: CouponsService) {}

  @Process('generate')
  async handleGenerate(job: Job) {
    this.logger.debug('쿠폰 생성 요청 수신');
    this.logger.debug(job.data);
    const { name, type, discount, count } = job.data;

    let errorCount = 0;
    for (let i = 0; i < count; i++) {
      const code = this.makeid(10);
      await this.couponsService
        .create({
          name,
          type,
          discount,
          code,
        })
        .catch((error) => {
          console.log(error);
          errorCount++;
        });
    }
    this.logger.debug('쿠폰 생성 완료');
    this.logger.debug(`일부 쿠폰 생성 실패 (${errorCount})`);
  }

  makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
