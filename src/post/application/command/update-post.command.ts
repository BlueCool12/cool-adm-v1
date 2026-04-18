import { PostStatus } from '@/post/domain/post-status.enum';

export interface UpdatePostCommandProps {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly contentJson: string;
  readonly contentMarkdown: string;
  readonly slug?: string | null;
  readonly description?: string | null;
  readonly categoryId?: number | null;
  readonly status: PostStatus;
}

export class UpdatePostCommand {
  readonly props: UpdatePostCommandProps;

  constructor(props: UpdatePostCommandProps) {
    this.props = props;
  }
}
