import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017');
mongoose.connection.on('error', (err) => console.log(err));
mongoose.connection.on('open', () => console.log("database connected"));

export default mongoose;