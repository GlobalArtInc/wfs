import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('vip_type')
export class VipTypeEntity {
  @PrimaryColumn('character varying')
  id: string;
  @Column('character varying')
  name: string;

  @OneToMany(() => VipEntity, (vip) => vip.type)
  vips: VipEntity[];
}

@Entity('vip')
export class VipEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.vips)
  @JoinColumn({ name: 'member_id' })
  member: UserEntity;

  @ManyToOne(() => VipTypeEntity, (vipType) => vipType.id)
  @JoinColumn({ name: 'type' })
  type: VipTypeEntity;

  @Column('integer')
  createdAt: number;
}
