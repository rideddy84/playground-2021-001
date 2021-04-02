import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Coupon } from './coupons/coupon.entity';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [Coupon],
      synchronize: true,
    }),
    CouponsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
