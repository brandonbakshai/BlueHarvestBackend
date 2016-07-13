import db from './db.js';

const Schema = db.Schema;
const BountySchema = new Schema({
  authors: [{ type: Schema.ObjectId, ref: 'User' }],
  projects: [{ type: Schema.ObjectId, ref: 'Project' }],
  tagline: String,
  description: String,
  statistics: {
    numberOfProjects: { type: Number, default: 0 },
    numberOfContributors: { type: Number, default: 0 },
    numberOfUpvotes: { type: Number, default: 0 },
    numberOfDownvotes: { type: Number, default: 0 }
  },
  tags: [String],
});
const Bounty = db.model('bounty', BountySchema);

export default Bounty;
