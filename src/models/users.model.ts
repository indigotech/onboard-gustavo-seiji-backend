export interface User {
  id: number;
  email: string;
  name: string;
  birthDate: Date;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
  birthDate: string;
}
