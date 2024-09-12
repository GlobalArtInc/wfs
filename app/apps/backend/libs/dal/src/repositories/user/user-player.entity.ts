import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, PrimaryColumn } from 'typeorm';
import { ServerEntity } from '../server';
import { UserEntity } from './user.entity';

@Entity('user_player')
export class UserPlayerEntity {
  @PrimaryColumn({ name: 'user_id', type: 'character varying' })
  userId: string;

  @Column('character varying')
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.usersPlayers)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
