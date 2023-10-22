import { Document } from 'mongoose';
import { Player } from '@/player/interfaces/player.interface';

export interface Category {
  readonly id: string;
  readonly name: string;
  description: string;
  events: Event[];
  players?: Player[];
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}

export type CategoryDocument = Category & Document;
