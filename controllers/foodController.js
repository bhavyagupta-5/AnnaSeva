import FoodPost from "../models/foodPost.js";

const createFoodPost = async (req, res) => {
  const food = await FoodPost.create({
    provider: req.user._id,
    ...req.body,
  });
  res.status(201).json(food);
};

const getMyFoodPosts = async (req, res) => {
  const foodPosts = await FoodPost.find({ provider: req.user._id });
  res.json(foodPosts);
};

const cancelFoodPost = async (req, res) => {
  const food = await FoodPost.findById(req.params.id);

  if (!food || food.status !== "available") {
    return res.status(400).json({ message: "Cannot cancel this post" });
  }

  food.status = "cancelled";
  food.cancelReason = req.body.reason;
  await food.save();

  res.json({ message: "Food post cancelled" });
};

export { createFoodPost, getMyFoodPosts, cancelFoodPost };
