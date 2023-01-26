import mongoose from 'mongoose';

const infoSchema = new mongoose.Schema({
    name: { type: String, require: true },
    phone: { type: String, require: true },
    voted: { type: Boolean, default: false, require: true },
});

export default mongoose.model('Info', infoSchema);
