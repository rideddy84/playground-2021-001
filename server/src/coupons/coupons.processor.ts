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
    const { count } = job.data;

    let errorCount = await this.createCoupons(job, count);
    this.logger.debug('쿠폰 생성 완료');
    this.logger.debug(`일부 쿠폰 생성 실패 (${errorCount})`);

    if (errorCount > 0) {
      /** 낮은 확률의 중복 오류 대응 */
      this.logger.debug('실패 건 재시도');
      errorCount = await this.createCoupons(job, errorCount);
      this.logger.debug(`잔여 실패 건 (${errorCount})`);
    }
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

  async createCoupons(job, count) {
    const { name, type, discount } = job.data;
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
    return errorCount;
  }
}
