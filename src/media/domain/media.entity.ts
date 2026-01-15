import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MediaType } from '@/media/domain/media-type.enum';
import { MediaMetadata } from '@/media/types/media.types';
import { Post } from '@/post/domain/post.entity';
import { BaseEntity } from '@/common/entity/base.entity';

export interface CreateMediaArgs {
  type: MediaType;
  storedName: string;
  originalName: string;
  mimeType: string;
  metadata: MediaMetadata;
  postId?: string;
}

@Entity('media')
export class Media extends BaseEntity {
  @Column()
  private type: MediaType;

  @Column({ name: 'stored_name' })
  private storedName: string;

  @Column({ name: 'original_name' })
  private originalName: string;

  @Column({ name: 'mime_type' })
  private mimeType: string;

  @Column({ type: 'jsonb', nullable: true })
  private metadata: MediaMetadata;

  @Column({ type: 'bigint', name: 'post_id', nullable: true })
  private postId: string | null;

  @ManyToOne(() => Post, (post) => post.medias, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'post_id' })
  public readonly post: Post;

  private url: string;

  @AfterLoad()
  updateUrl() {
    const baseUrl = process.env.MEDIA_BASE_URL;
    this.url = `${baseUrl}/${this.storedName}`;
  }

  private constructor() {
    super();
  }

  static create(args: CreateMediaArgs): Media {
    const media = new Media();

    media.storedName = args.storedName;
    media.originalName = args.originalName;
    media.mimeType = args.mimeType;
    media.type = args.type;
    media.metadata = args.metadata;
    media.postId = args.postId ?? null;

    return media;
  }

  // getter
  public getStoredName(): string {
    return this.storedName;
  }

  public getOriginalName(): string {
    return this.originalName;
  }

  public getMimeType(): string {
    return this.mimeType;
  }

  public getUrl(): string {
    return this.url;
  }
}
