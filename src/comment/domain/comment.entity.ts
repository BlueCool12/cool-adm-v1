import { Post } from '@/post/domain/post.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommentStatus } from '@/comment/domain/comment-status.enum';
import { CoreEntity } from '@/common/entity/base.entity';

@Entity('comment')
export class Comment extends CoreEntity {
  @Column({ name: 'parent_id', type: 'int8', nullable: true })
  private parentId?: string | null = null;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  @JoinColumn({ name: 'parent_id' })
  private parent?: Comment | null = null;

  @Column({ name: 'admin_id', type: 'int8', nullable: true })
  private adminId?: string | null = null;

  @OneToMany(() => Comment, (comment) => comment.parent)
  private replies!: Comment[];

  @Column()
  private nickname!: string;

  @Column('text')
  private content!: string;

  @Column()
  private password!: string;

  @Column({ name: 'post_id' })
  private postId!: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  private post!: Post;

  @Column({ name: 'is_deleted', default: false })
  private isDeleted!: boolean;

  @Column()
  private status!: CommentStatus;

  private constructor() {
    super();
  }

  public static createReply(params: {
    postId: string;
    parentId: string;
    content: string;
    adminId: string;
    nickname: string;
    password: string;
  }): Comment {
    const reply = new Comment();
    reply.postId = params.postId;
    reply.parentId = params.parentId;
    reply.content = params.content;
    reply.adminId = params.adminId;
    reply.nickname = params.nickname;

    if (!params.password) throw new Error('관리자 답변 비밀번호가 존재하지 않습니다.');
    reply.password = params.password;

    reply.status = CommentStatus.PUBLISHED;
    return reply;
  }

  // behavior
  public hide(): void {
    this.status = CommentStatus.HIDDEN;
  }

  public publish(): void {
    this.status = CommentStatus.PUBLISHED;
  }

  public delete(): void {
    this.status = CommentStatus.DELETED;
  }

  // getter
  public getParentId(): string | null {
    return this.parentId ?? null;
  }

  public getAdminId(): string | null {
    return this.adminId ?? null;
  }

  public getReplies(): Comment[] {
    return this.replies;
  }

  public getNickname(): string {
    return this.nickname;
  }

  public getContent(): string {
    return this.content;
  }

  public getPostId(): string {
    return this.postId;
  }

  public getPost(): Post {
    return this.post;
  }

  public getIsDeleted(): boolean {
    return this.isDeleted;
  }

  public getStatus(): CommentStatus {
    return this.status;
  }
}
