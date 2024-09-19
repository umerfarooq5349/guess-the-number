import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export interface PlayerDocument extends Document {
  highestScore: number;
  scores: { value: number; date: Date }[];
  lastPlayed: Date;
  name: string;
  email: string;
  password: string;
  photo?: string;
  checkPassword(password: string, hashedPassword: string): Promise<boolean>; // Method to check password
}

export interface PlayerModel extends Model<PlayerDocument> {
  checkPassword(password: string, hashedPassword: string): Promise<boolean>;
}

const playerSchema = new mongoose.Schema<PlayerDocument, PlayerModel>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    // required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  highestScore: {
    type: Number,
    default: 0,
  },
  scores: [
    {
      value: {
        type: Number,
        required: true,
        default: 0,
      },
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  lastPlayed: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
    default: "/assets/avatar.png",
  },
});

playerSchema.pre("save", async function (next) {
  // Only hash the password if it's new or has been modified
  if (!this.isModified("password")) return next();

  // Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare passwords
playerSchema.methods.checkPassword = function (
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
};

// Create the Player model
const Player = mongoose.model<PlayerDocument, PlayerModel>(
  "Player",
  playerSchema
);

export default Player;
