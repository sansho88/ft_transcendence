export interface UsersInterface {
  id?: number;
  username?: string;
  status?: number;
  avatar_path?: string;
  token_2fa?: string;
  has_2fa: boolean;
}
