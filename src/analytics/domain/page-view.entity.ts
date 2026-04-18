import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('page_view')
export class PageView {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public readonly id!: string;

  @Index()
  @Column()
  private url!: string;

  @Column({ type: 'varchar', nullable: true })
  private slug?: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  private referrer?: string | null = null;

  @Column({ name: 'ip_address', type: 'varchar', length: 255, nullable: true })
  private ipAddress?: string | null = null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  private userAgent?: string | null = null;

  @Column({ name: 'device_type', type: 'varchar', length: 20, nullable: true })
  private deviceType?: string | null = null;

  @Column({ name: 'client_id', type: 'uuid', nullable: true })
  private clientId?: string | null = null;

  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  private sessionId?: string | null = null;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public readonly createdAt!: Date;
}
