import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PostStatus } from '@/post/domain/post-status.enum';
import { Slug } from '@/common/vo/slug.vo';
import { Media } from '@/media/domain/media.entity';
import { BaseEntity } from '@/common/entity/base.entity';
import { Category } from '@/category/domain/category.entity';

@Entity('post')
export class Post extends BaseEntity {
  private static readonly MAX_TITLE_LENGTH = 70;
  private static readonly MAX_SLUG_LENGTH = 150;
  private static readonly MAX_DESCRIPTION_LENGTH = 200;

  private static defaultDraftTitle(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    return `${yyyy}년 ${mm}월 ${dd}일의 새로운 글`;
  }

  @Column({ length: 70 })
  private title: string;

  @Column('text')
  private content: string;

  @Column({ name: 'content_json', type: 'text', nullable: true })
  private contentJson: string | null;

  @Column({ type: 'varchar', default: PostStatus.DRAFT })
  private status: PostStatus;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
  private slug: string | null;

  @Column({ type: 'text', nullable: true })
  private description: string;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  private categoryId: number | null;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  public readonly category: Category;

  @OneToMany(() => Media, (media) => media.post)
  public readonly medias: Media[];

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  private publishedAt: Date;

  private constructor() {
    super();
  }

  public static createDraft(): Post {
    const post = new Post();

    post.title = Post.defaultDraftTitle();
    post.content = '';
    post.status = PostStatus.DRAFT;

    return post;
  }

  // behavior
  public updateDetails(params: {
    title: string;
    content: string;
    contentJson?: string;
    slug: string;
    description: string;
    categoryId: number;
  }): void {
    this.validateTitle(params.title);
    this.validateDescription(params.description);

    if (this.status === PostStatus.PUBLISHED) {
      if (params.title.length < 2) throw new Error('발행된 글의 제목은 너무 짧을 수 없습니다.');
    }

    if (params.slug) {
      const slugVo = new Slug(params.slug, Post.MAX_SLUG_LENGTH);
      this.slug = slugVo.getValue();
    } else {
      this.slug = null;
    }

    if (params.contentJson !== undefined) this.contentJson = params.contentJson;

    this.title = params.title;
    this.content = params.content;
    this.description = params.description;
    this.categoryId = params.categoryId === 0 ? null : params.categoryId;
  }

  public changeStatus(newStatus: PostStatus): void {
    if (this.status === newStatus) return;

    switch (newStatus) {
      case PostStatus.PUBLISHED:
        this.publish();
        break;
      case PostStatus.ARCHIVED:
        this.archive();
        break;
      case PostStatus.DRAFT:
        this.draft();
        break;
    }
  }

  private publish(): void {
    this.validatePublishingConditions();
    this.status = PostStatus.PUBLISHED;
    if (!this.publishedAt) {
      this.publishedAt = new Date();
    }
  }

  private archive(): void {
    this.status = PostStatus.ARCHIVED;
  }

  private draft(): void {
    this.status = PostStatus.DRAFT;
  }

  // validation
  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) throw new Error('제목은 필수 입력 사항입니다.');
    if (title.length > Post.MAX_TITLE_LENGTH) {
      throw new Error(`제목은 ${Post.MAX_TITLE_LENGTH}자를 초과할 수 없습니다.`);
    }
  }

  private validateDescription(description: string): void {
    if (description && description.length > Post.MAX_DESCRIPTION_LENGTH) {
      throw new Error(`요약은 ${Post.MAX_DESCRIPTION_LENGTH}자를 초과할 수 없습니다.`);
    }
  }

  private validatePublishingConditions(): void {
    if (!this.title || this.title.trim().length < 2) {
      throw new Error('발행하려면 제목을 2자 이상 입력해야 합니다.');
    }

    if (!this.content || this.content.trim().length < 10) {
      throw new Error('본문 내용이 너무 짧습니다.');
    }

    if (!this.categoryId) throw new Error('카테고리는 필수입니다.');
    if (!this.slug) throw new Error('슬러그는 필수입니다.');
    if (!this.description) throw new Error('요약은 필수입니다.');
  }

  // getter
  public getTitle(): string {
    return this.title;
  }

  public getContent(): string {
    return this.content;
  }

  public getCategoryId(): number | null {
    return this.categoryId;
  }

  public getSlug(): string | null {
    return this.slug;
  }

  public getDescription(): string {
    return this.description;
  }

  public getStatus(): PostStatus {
    return this.status;
  }

  public getPublishedAt(): Date | null {
    return this.publishedAt;
  }
}
