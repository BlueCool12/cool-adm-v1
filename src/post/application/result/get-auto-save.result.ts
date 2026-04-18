export interface AutoSaveData {
  title?: string;
  content?: string;
  contentJson?: string;
  description?: string;
  categoryId?: number;
  savedAt?: string | number | Date;
}

export class GetAutoSaveResult {
  constructor(
    readonly title?: string,
    readonly content?: string,
    readonly contentJson?: string,
    readonly description?: string,
    readonly categoryId?: number,
    readonly savedAt?: Date,
  ) {}

  static fromData(data: AutoSaveData): GetAutoSaveResult {
    return new GetAutoSaveResult(
      data.title,
      data.content,
      data.contentJson,
      data.description,
      data.categoryId,
      data.savedAt ? new Date(data.savedAt) : undefined,
    );
  }
}
