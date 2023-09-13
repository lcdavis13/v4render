import { Schema, model, models } from 'mongoose';

const ResultSchema = new Schema({
  date: {
    type: String,
    required: [true, 'Date is required.'],
  },
  home_team: {
    type: String,
    required: [true, 'Home Team is required.'],
  },
  away_team: {
    type: String,
    required: [true, 'Away Team is required.'],
  },
  home_score: {
    type: Number,
    required: [true, 'Home Score is required.'],
  },
  away_score: {
    type: Number,
    required: [true, 'Away Score is required.'],
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
  },
  country: {
    type: String,
    required: [true, 'Country is required.'],
  },
});

const Result = models.Result || model('Result', ResultSchema);

export default Result;