import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class DateEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

// ===========================================================

export abstract class LiteEntity extends DateEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}

export abstract class CoreEntity extends DateEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;
}

// ===========================================================

export abstract class BaseEntity extends CoreEntity {
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
