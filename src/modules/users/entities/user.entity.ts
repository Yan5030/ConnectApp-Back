import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
// import { Post } from '../posts/post.entity';
// import { Comment } from '../comments/comment.entity';
// import { Reaction } from '../reactions/reaction.entity';
// import { Friendship } from '../friendships/friendship.entity';
// import { Message } from '../messages/message.entity';
// import { Notification } from '../notifications/notification.entity';
// import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  coverPicture: string;

  @Column({ default: 'Hello, I am using this platform!' })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 'active' })
  status: string;  // Por ejemplo: active, deactivated, suspended

//   // Relaciones con publicaciones
//   @OneToMany(() => Post, (post) => post.user)
//   posts: Post[];

//   // Relaciones con comentarios
//   @OneToMany(() => Comment, (comment) => comment.user)
//   comments: Comment[];

//   // Relaciones con reacciones
//   @OneToMany(() => Reaction, (reaction) => reaction.user)
//   reactions: Reaction[];

//   // Relaciones con amigos
//   @ManyToMany(() => User)
//   @JoinTable()
//   friends: User[];

//   // Solicitudes de amistad
//   @OneToMany(() => Friendship, (friendship) => friendship.requester)
//   sentFriendRequests: Friendship[];

//   @OneToMany(() => Friendship, (friendship) => friendship.receiver)
//   receivedFriendRequests: Friendship[];

//   // Mensajes privados
//   @OneToMany(() => Message, (message) => message.sender)
//   sentMessages: Message[];

//   @OneToMany(() => Message, (message) => message.receiver)
//   receivedMessages: Message[];

//   // Notificaciones
//   @OneToMany(() => Notification, (notification) => notification.user)
//   notifications: Notification[];

//   // Reportes realizados por el usuario
//   @OneToMany(() => Report, (report) => report.reporter)
//   reports: Report[];

//   // Reportes que ha recibido el usuario
//   @OneToMany(() => Report, (report) => report.reportedUser)
//   receivedReports: Report[];
}
