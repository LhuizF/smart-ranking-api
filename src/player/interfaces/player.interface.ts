import { Document } from 'mongoose';

export interface Player {
  readonly id: string;
  name: string;
  readonly email: string;
  phone: string;
  readonly ranking: string;
  readonly rankingPosition: number;
  readonly urlPhoto: string;
}

export type PlayerDocument = Player & Document;
