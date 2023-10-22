import { Document } from 'mongoose';
import { Player } from '@/player/interfaces/player.interface';
import { ChallengeStatus } from './challengeStatus.enum';

export interface Challenge {
  challengeDate: Date;
  status: ChallengeStatus;
  requestDate: Date;
  responseDate: Date;
  requester: Player; // Desafiante
  category: string;
  players: Player[];
  match: Match;
}

export interface Match {
  category: string;
  players: Player[];
  winner: Player;
  results: Result[];
}

export interface Result {
  set: string;
}

export type ChallengeDocument = Challenge & Document;
export type MatchDocument = Match & Document;
