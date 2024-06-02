import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('achievement')
export class AchievementEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('character varying')
  achievementId: string;

  @Column('character varying')
  name: string;

  @Column('character varying', { nullable: true })
  description: string;
}
