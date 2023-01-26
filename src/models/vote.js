import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
    {
        infoId: { type: mongoose.Schema.Types.ObjectId, required: true },
        choiceList: { type: [Number], required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Vote', voteSchema);
