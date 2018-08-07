import dotenv from 'dotenv';

dotenv.config();

const config = {
  OWNER_ID: '412077846626959360', // Bot owners Discord ID
  COMMAND_PREFIX: '$',
  STEEM_ACCOUNT: 'promo-mentors',
  MANAGER_ROLE: ['Founder', 'Recruiter'], // Can add/remove workshops and mentors
  MENTOR_ROLE: ['Mentor'], // Can open and close workshops
};

export default config;
