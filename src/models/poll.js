import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
    choiceList: { type: [String], default: [] },
    resultList: { type: [Number], default: [] },
    state: { type: String, default: 'close' },
});

export default mongoose.model('Poll', pollSchema);