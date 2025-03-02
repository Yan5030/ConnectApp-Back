import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from '../../users/entities/user.entity'
import { Comment } from "../../comments/entities/comment.entity";
import { Reaction } from "../../reactions/entities/reaction.entity"
import { PrivacyEnum } from "src/enum/privacy.enum";

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "text", nullable: true })
  content: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  image: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  video: string;

  @Column({ type: "enum", enum: PrivacyEnum, default: PrivacyEnum.PUBLIC })
  privacy: string;

  @CreateDateColumn({ type: "timestamp"})
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions?: Reaction[];
}
