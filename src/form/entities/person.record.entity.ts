import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'person_records' })
export class PersonRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  cidade: string;
}