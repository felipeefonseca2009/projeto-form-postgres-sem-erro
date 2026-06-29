import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity({ name: 'researchers' })
export class Researcher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nome!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ type: 'date', nullable: false })
  data_nascimento!: string;

  @Column({ nullable: false })
  telefone!: string;

  @Column({ nullable: false })
  cidade!: string;

  @Column({ nullable: false })
  pais!: string;

  @Column({ nullable: false })
  area_atuacao!: string;

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