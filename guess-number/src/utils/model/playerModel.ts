export interface PlayerModel {
  _id: string;
  highestScore: number;
  scores: [{ value: number; date: Date }];
  lastPlayed: Date;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
