import TypeORM from typeorm
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { RefreshTokens } from "./RefreshTokens";
import { Resumes } from "./Resumes";

@Entity("Users")
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  authCode: string;

  @CreateDateColumn({ name: "createAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;

  @OneToMany(() => RefreshTokens, refreshToken => refreshToken.user)
  refreshTokens: RefreshTokens[];

  @OneToMany(() => Resumes, resume => resume.user)
  resumes: Resumes[];
}
