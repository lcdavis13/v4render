import { Schema, model, models } from 'mongoose';

const GoalScorerSchema = new Schema({
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
  own_goal: {
    type: Boolean,
    required: [true, 'Was it an own goal? This field is required.'],
  },
  penalty: {
    type: Boolean,
    required: [true, 'Was it a penalty? This field is required.'],
  }
});

const GoalScorer = models.GoalScorer || model('GoalScorer', GoalScorerSchema);

export default GoalScorer;