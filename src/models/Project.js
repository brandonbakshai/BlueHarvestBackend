import db from './db.js';

const Schema = db.Schema;
const ProjectSchema = new Schema({
  authors: [{ type: Schema.ObjectId, ref: 'User' }],
  bounty:[{ type: Schema.ObjectId, ref: 'Bounty' }],
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  statistics: {
    numberOfContributors: { type: Number, default: 0 },
    numberOfUpvotes: { type: Number, default: 0 },
    numberOfDownvotes: { type: Number, default: 0 }
  },
  tags: [String],
});
const Project = db.model('Project', ProjectSchema);

export default Project;
