const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({

  loginTime: {
    type: Date,
    default: Date.now
  },

  logoutTime: {
    type: Date,
    default: null
  },

  duration: {
    type: Number,
    default: 0
  } // seconds

});

const userSchema = new mongoose.Schema({

  /*
   -----------------------------------
   BASIC INFO
   -----------------------------------
  */

  name: {
    type: String,
    required: true,
    trim: true
  },

  telephone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  /*
   -----------------------------------
   PROFILE
   -----------------------------------
  */

  avatar: {
    type: String,
    default: ""
  },

  bio: {
    type: String,
    default: ""
  },

  /*
   -----------------------------------
   ROLE
   -----------------------------------
  */

  isAdmin: {
    type: Boolean,
    default: false
  },

  /*
   -----------------------------------
   CONTACTS
   -----------------------------------
  */

  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  /*
   -----------------------------------
   SESSION TRACKING
   -----------------------------------
  */

  sessions: [sessionSchema],

  lastLoginAt: {
    type: Date,
    default: null
  },

  totalTimeSpent: {
    type: Number,
    default: 0
  },

  isOnline: {
    type: Boolean,
    default: false
  },

  /*
   -----------------------------------
   CREATED DATE
   -----------------------------------
  */

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "User",
  userSchema
);