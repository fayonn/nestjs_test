import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Partial<Post>[];
}
