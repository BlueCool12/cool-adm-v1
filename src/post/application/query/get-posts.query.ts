export class GetPostsQuery {
  search?: string;
  page: number;
  limit: number;
  status?: string;
  categoryId?: number;
  startDate?: string;
  endDate?: string;

  constructor(props: Partial<GetPostsQuery>) {
    this.search = props.search;
    this.page = props.page ?? 1;
    this.limit = props.limit ?? 10;
    this.status = props.status;
    this.categoryId = props.categoryId;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }
}
