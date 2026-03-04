import FoodPost from "../models/foodPost.js";
import User from "../models/User.js";

const nearbyFood = async (req, res) => {
  const { lng, lat } = req.query;

  const food = await FoodPost.find({
    status: "available",
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: 5000,
      },
    },
  });

  res.json(food);
};

const acceptPickup = async (req, res) => {
  const food = await FoodPost.findById(req.params.id);

  food.status = "assigned";
  food.assignedVolunteer = req.user._id;
  await food.save();

  res.json({ message: "Pickup accepted" });
};

const markDelivered = async (req, res) => {
  const food = await FoodPost.findById(req.params.id);

  food.status = "delivered";
  food.deliveryImage = req.body.image;
  await food.save();

  const volunteer = await User.findById(req.user._id);
  volunteer.rewardPoints += 10;
  await volunteer.save();

  res.json({ message: "Delivery completed" });
};

export { nearbyFood, acceptPickup, markDelivered };
