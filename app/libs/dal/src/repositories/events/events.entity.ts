import { BaseEntity } from '@app/dal/base-entity';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class EventsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  eventId: number;

  @Column('character varying')
  type: string;

  @Column('character varying')
  data: string;
}
