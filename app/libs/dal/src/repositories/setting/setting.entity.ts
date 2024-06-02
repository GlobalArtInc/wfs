import { BaseEntity } from '@app/dal/base-entity';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('setting')
export class SettingEntity {
  @PrimaryColumn('character varying', { name: 'key' })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('jsonb', { default: {} })
  value: Record<string, unknown>;
}
