export class UpdateProfileCommand {
  constructor(
    public readonly id: string,
    public readonly nickname: string,
    public readonly profileImageUrl: string | null,
  ) {}
}
