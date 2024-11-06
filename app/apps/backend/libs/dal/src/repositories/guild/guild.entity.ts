import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('guild')
export class GuildEntity {
  @PrimaryColumn('character varying')
  id: string;
  @Column('character varying')
  defaultChannel: string;
  @Column('character varying')
  language: string;
}
