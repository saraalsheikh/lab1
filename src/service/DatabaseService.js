import mongoose from 'mongoose';
const { Schema } = mongoose;

const DatabaseService = {};

DatabaseService.connect = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('MongoDB connection established');
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

const dishSchema = new Schema({
  name: String,
  ingredients: [String],
  preparationSteps: [String],
  cookingTime: Number,
  origin: String,
  difficulty: String
});

dishSchema.index({ name: 'text', ingredients: 'text', origin: 'text' });

DatabaseService.Dish = mongoose.model('Dish', dishSchema);

export default DatabaseService;