import { Schema, model, models } from 'mongoose';

const PenaltySchema = new Schema({
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
  winner: {
    type: String,
    required: [true, 'Winner is required.'],
  },
});

const Penalty = models.Penalty || model('Penalty', PenaltySchema);

export default Penalty;