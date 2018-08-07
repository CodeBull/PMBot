import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema({
  username: String,
  discordId: {
    type: String,
    unique: true,
    dropDups: true,
  },
  workshops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workshop',
  }],
}, { timestamps: true });

const Mentor = mongoose.model('mentor', MentorSchema);

export default Mentor;
