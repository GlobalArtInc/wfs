import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('server')
export class ServerEntity {
  @PrimaryColumn('character varying')
  id: string;

  @Column('character varying')
  name: string;

  @OneToMany(() => UserEntity, (user) => user.defaultServer)
  users: UserEntity[];
}
