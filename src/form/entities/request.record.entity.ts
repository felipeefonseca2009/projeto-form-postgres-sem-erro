import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'request_records' })
export class RequestRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  assunto: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ nullable: true })
  data: string;
}