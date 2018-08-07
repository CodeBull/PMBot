import mongoose from 'mongoose';

const WorkshopSchema = new mongoose.Schema({
  name: String,
  workshopId: {
    type: Number,
    unique: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'mentor',
  },
  channelId: {
    type: String,
    unique: true,
    dropDups: true,
  },
  price: {
    type: String,
  },
  day: String,
  time: String,
  open: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Workshop = mongoose.model('workshop', WorkshopSchema);

export default Workshop;
