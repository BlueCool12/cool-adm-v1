import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('page_view')
export class PageView {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public readonly id: string;

  @Index()
  @Column()
  private url: string;

  @Column({ nullable: true })
  private slug: string;

  @Column({ nullable: true })
  private referrer: string;

  @Column({ name: 'ip_address', length: 255, nullable: true })
  private ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  private userAgent: string;

  @Column({ name: 'device_type', length: 20, nullable: true })
  private deviceType: string;

  @Column({ name: 'session_id', length: 64, nullable: true })
  private sessionId: string;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public readonly createdAt: Date;
}
