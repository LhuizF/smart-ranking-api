import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    ranking: { type: String },
    rankingPosition: { type: Number },
    urlPhoto: { type: String },
  },
  { timestamps: true, collection: 'players' }
);
