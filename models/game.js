import { Schema, model, models } from 'mongoose';

const GameSchema = new Schema({
  date: {
    type: String,
    required: [true, 'Date is required.'],
  },
  home_team: {
    type: String,
    required: [true, 'Home team is required.'],
  },
  away_team: {
    type: String,
    required: [true, 'Away team is required.'],
  },
  home_score: {
    type: Number,
    required: [true, 'Home score is required.'],
  },
  away_score: {
    type: Number,
    required: [true, 'Away score is required.'],
  },
  tournament: {
    type: String,
    required: [true, 'Tournament is required.'],
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
  },
  country: {
    type: String,
    required: [true, 'Country is required.'],
  },
  neutral: {
    type: Boolean,
    required: [true, 'Was it in a neutral setting? This field is required.'],
  }
});

const Game = models.Game || model('Game', GameSchema);

export default Game;