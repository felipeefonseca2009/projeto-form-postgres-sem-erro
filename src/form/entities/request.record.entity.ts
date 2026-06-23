import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Researcher } from './person.record.entity';

@Entity({ name: 'request_records' })
export class RequestRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  assunto!: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ nullable: true })
  data?: string;

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