import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Post } from "../../posts/entities/post.entity";
import { ReactionEnum } from "src/enum/reaction.enum";
import { Comment } from "src/modules/comments/entities/comment.entity";

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "enum", enum: ReactionEnum, default: ReactionEnum.LIKE })
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reactions, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Post, (post) => post.reactions, {nullable: true, onDelete: "CASCADE" })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.reactions, {nullable: true, onDelete: "CASCADE"})
  comment: Comment;
}
