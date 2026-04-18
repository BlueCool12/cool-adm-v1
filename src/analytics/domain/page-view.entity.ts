import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('page_view')
export class PageView {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public readonly id!: string;

  @Index()
  @Column()
  private url!: string;

  @Column({ nullable: true })
  private slug!: string | null;

  @Column({ nullable: true })
  private referrer!: string | null;

  @Column({ name: 'ip_address', length: 255, nullable: true })
  private ipAddress!: string | null;

  @Column({ name: 'user_agent', nullable: true })
  private userAgent!: string | null;

  @Column({ name: 'device_type', length: 20, nullable: true })
  private deviceType!: string | null;

  @Column({ name: 'client_id', type: 'uuid', nullable: true })
  private clientId!: string | null;

  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  private sessionId!: string | null;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public readonly createdAt!: Date;
}
