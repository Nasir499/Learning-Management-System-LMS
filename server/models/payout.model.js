import { model, Schema } from 'mongoose';

const payoutSchema = new Schema({
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    coursePrice: {
        type: Number,
        required: true
    },
    instructorEarnings: {
        type: Number,
        required: true
    },
    adminCommission: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAID'],
        default: 'PENDING'
    },
    paidAt: {
        type: Date
    }
}, { timestamps: true });

const Payout = model('Payout', payoutSchema);

export default Payout;
