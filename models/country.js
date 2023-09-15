import { Schema, model, models } from 'mongoose';

const CountrySchema = new Schema({
  country: {
    type: String,
    required: [true, 'Country is required.'],
  },
  appearances: {
    type: Number,
    required: [true, 'Appearances is required.'],
  },
  first_game: {
    type: String,
    required: [true, 'First game date is required.'],
  },
  last_game: {
    type: String,
    required: [true, 'Last game date is required.'],
  },
  total_goals: {
    type: Number,
    required: [true, 'Total goals is required.'],
  }
});

const Country = models.Country || model('Country', CountrySchema);

export default Country;