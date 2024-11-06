import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_clan')
export class UserClanEntity {
  @PrimaryColumn({ name: 'user_id', type: 'character varying' })
  userId: string;

  @Column('character varying')
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.usersClans)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
