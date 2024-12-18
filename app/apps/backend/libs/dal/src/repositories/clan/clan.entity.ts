import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clan')
@Unique(['id', 'server'])
export class ClanEntity {
  @PrimaryColumn('character varying', { name: 'clan_id' })
  clanId: string;

  @Column('int')
  id: number;

  @Column('character varying')
  server: string;

  @Column('character varying')
  name: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => ClanMemberEntity, (clanMember) => clanMember.clan, {
    cascade: true,
  })
  members: ClanMemberEntity[];
}

@Entity('clan_member')
export class ClanMemberEntity {
  @PrimaryColumn('character varying')
  clanId: number;

  @PrimaryColumn('character varying')
  nickname: string;

  @Column('character varying')
  rankId: string;

  @Column('character varying')
  clanPoints: string;

  @Column('character varying')
  clanRole: string;

  @ManyToOne(() => ClanEntity, (clan) => clan.members, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clan_id' })
  clan: ClanEntity;
}
