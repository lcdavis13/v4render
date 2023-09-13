import { Schema, model, models } from 'mongoose';

const GoalScorerSchema = new Schema({
  date: {
    type: String,
    ref: 'User',
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
  team: {
    type: String,
    required: [true, 'Team is required.'],
  },
  scorer: {
    type: String,
    required: [true, 'Scorer is required.'],
  },
  minute: {
    type: Number,
    required: [true, 'Minute of the goal is required.'],
  },
  is_own_goal: {
    type: Boolean,
    required: [true, 'Was it an own goal? This field is required.'],
  },
  is_penalty: {
    type: Boolean,
    required: [true, 'Was it a penalty? This field is required.'],
  }
});

const GoalScorer = models.GoalScorer || model('Prompt', GoalScorerSchema);

export default GoalScorer;