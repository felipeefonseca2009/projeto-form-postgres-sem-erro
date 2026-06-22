import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity({ name: 'researchers' })
export class Researcher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  telefone?: string;

  @Column({ nullable: true })
  cidade?: string;

  @Column({ nullable: true })
  pais?: string;

  @Column({ nullable: true })
  area_atuacao?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  user_id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}