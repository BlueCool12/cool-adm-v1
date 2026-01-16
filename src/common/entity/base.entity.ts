import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class DateEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public readonly createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public readonly updatedAt: Date;
}

// ===========================================================

export abstract class LiteEntity extends DateEntity {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;
}

export abstract class CoreEntity extends DateEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public readonly id: string;
}

// ===========================================================

export abstract class BaseEntity extends CoreEntity {
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public readonly deletedAt: Date | null;
}
