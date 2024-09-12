import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { ServerEntity } from '../server';
import { UserClanEntity } from './user-clan.entity';
import { UserPlayerEntity } from './user-player.entity';
import { VipEntity } from '../vip';

@Entity('user')
export class UserEntity {
  @PrimaryColumn('character varying')
  id: string;

  @Column('character varying')
  client: string;

  @OneToOne(() => ServerEntity, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'default_server', referencedColumnName: 'id' })
  defaultServer: ServerEntity;

  @Column('character varying')
  language: string;

  @Column('character varying', { nullable: true })
  username: string;

  @OneToMany(() => UserPlayerEntity, (userPlayer) => userPlayer.user, {
    cascade: true,
  })
  usersPlayers: UserPlayerEntity[];

  @OneToMany(() => UserClanEntity, (userClan) => userClan.user, {
    cascade: true,
  })
  usersClans: UserClanEntity[];

  @OneToMany(() => VipEntity, (vip) => vip.member, {
    cascade: true,
  })
  vips: VipEntity[];
}
