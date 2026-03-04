const restrictTo = (...roles) => { //roles is an attribute that can take multiple values like provider, volunteer, admin
  return (req, res, next) => { // arrow function executes variables in one line
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export default restrictTo;
