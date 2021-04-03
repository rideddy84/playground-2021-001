import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CouponType {
  AMOUNT = 'amount',
  PERCENT = 'percent',
}
@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.AMOUNT,
  })
  type: CouponType;

  @Column()
  discount: number;

  @Column({
    unique: true,
  })
  code: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
