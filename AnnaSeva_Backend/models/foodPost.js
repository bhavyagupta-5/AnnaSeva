import mongoose from "mongoose";

const foodPostSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  description: String,
  quantity: String,
  expiryTime: Date,

  images: [String],

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: [Number],
  },

  status: {
    type: String,
    enum: ["available", "assigned", "picked", "delivered", "cancelled"],
    default: "available",
  },

  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  pickupImage: String,
  deliveryImage: String,

  cancelReason: String,
}, { timestamps: true });

foodPostSchema.index({ location: "2dsphere" });

export default mongoose.model("FoodPost", foodPostSchema);
