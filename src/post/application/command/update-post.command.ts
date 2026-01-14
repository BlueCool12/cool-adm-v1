import { PostStatus } from '@/post/domain/post-status.enum';

export interface UpdatePostCommandProps {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly contentJson?: string;
  readonly slug: string;
  readonly description: string;
  readonly categoryId: number;
  readonly status: PostStatus;
}

export class UpdatePostCommand {
  readonly props: UpdatePostCommandProps;

  constructor(props: UpdatePostCommandProps) {
    this.props = props;
  }
}
