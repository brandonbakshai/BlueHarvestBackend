'use strict';

import db from './db.js';

const Schema = db.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content : {
    text: {
      body:  {
        type:     String,
        required: true
      }
    },
    media: [{
        description: String,
        typeOfMedia: {
          type: String,
          enum: ['video', 'image', 'audio', 'thumbnail'],
          required: true
        },
        contentUrl: String,
        height:     Number,
        width:      Number
    }],
  },
  meta: {
    dateCreated: {
      type: Date,
      required: true
    },
    authors: {
      type: [Schema.ObjectId],
      ref: 'User',
      required: true, // TODO add length validation
    },
    contributors: {
      type: Number,
      default: 0
    },
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    },
    tags: [String]
  },
});
const Post = db.model('Post', PostSchema);

export default Post;

