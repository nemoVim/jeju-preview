import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        choiceList: { type: [Number], required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Vote', voteSchema);