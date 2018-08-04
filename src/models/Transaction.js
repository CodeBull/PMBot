import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  discordId: String,
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workshop',
  },
  amount: String,
  memo: String,
  verified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Transaction = mongoose.model('transaction', TransactionSchema);

export default Transaction;
