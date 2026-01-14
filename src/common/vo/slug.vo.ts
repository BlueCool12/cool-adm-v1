export class Slug {
  private static readonly PATTERN = /^[a-z0-9-_]+$/;
  private readonly value: string;

  constructor(value: string, maxLength: number) {
    const normalizedValue = value.toLowerCase();
    this.validate(normalizedValue, maxLength);
    this.value = normalizedValue;
  }

  private validate(value: string, maxLength: number): void {
    if (!value || value.trim().length === 0) throw new Error('슬러그는 필수입니다.');

    if (value.length > maxLength) {
      throw new Error(`슬러그가 최대 길이(${maxLength}자)를 초과했습니다.`);
    }

    if (!Slug.PATTERN.test(value)) throw new Error('슬러그 형식이 올바르지 않습니다.');
  }

  public getValue(): string {
    return this.value;
  }
}
