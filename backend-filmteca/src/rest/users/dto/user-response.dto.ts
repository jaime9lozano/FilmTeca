export class UserDto {
  id: number;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date | null;
  roles: string[];
}
