import { BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import * as moment from 'moment';

@Entity('weapon')
export class WeaponEntity {
  @PrimaryColumn('character varying')
  id: string;

  @Column('character varying')
  category: string;

  @Column('character varying', { nullable: true })
  nameRu?: string;

  @Column('character varying', { nullable: true })
  nameEn?: string;

  @Column('timestamp with time zone', { nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  onInsert() {
    this.updatedAt = moment().toDate();
  }
}

@Entity('weapon_category')
export class WeaponCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying')
  categoryId: string;

  @Column('character varying')
  name: string;
}
