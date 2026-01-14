export class UpdateCategoryCommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly slug: string,
    public readonly parentId: number | null,
  ) {}
}
