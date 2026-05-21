import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    telephone: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
   avatar: {
       type: String,
   }
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;