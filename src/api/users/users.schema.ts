export interface CreateUserRequestBody {
  email: string;
  password: string;
  name: string;
  birthdate: string;
}

export interface CreateUserResponse {
  id: number;
  name: string;
  email: string;
  birthdate: Date;
}
