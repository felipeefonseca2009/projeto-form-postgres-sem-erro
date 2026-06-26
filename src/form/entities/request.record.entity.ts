import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Researcher } from './person.record.entity';

@Entity({ name: 'request_records' })
export class RequestRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nome!: string;

  @Column({ nullable: false })
  assunto!: string;

  @Column({ type: 'text', nullable: false })
  descricao!: string;

  @Column({ nullable: false })
  data!: string;

  @ManyToOne(() => Researcher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'researcher_id' })
  researcher!: Researcher;

  @Column()
  researcher_id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}