import mongoose from "mongoose";

const deliveryLogSchema = new mongoose.Schema({
  foodPost: { type: mongoose.Schema.Types.ObjectId, ref: "FoodPost" },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  pickupImage: String,
  deliveryImage: String,

  status: String,
}, { timestamps: true });

export default mongoose.model("DeliveryLog", deliveryLogSchema);
