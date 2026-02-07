import User from "../models/User.js"
import generateToken from "../utils/generatetoken.js"


const registerUser = async (req,res) =>{
    const {name,email,password,role} = req.body 

const userExists = await User.findOne({email})
if(userExists){
     return res.status(400).json({ message: "User Already Exists" });
    
}
const user = await User.create({name,email,password,role})
if(user){
    res.status(201).json({
        _id : user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token : generateToken(user._id)
    })
}else{
   return res.status(400).json({ message: "Invalid Credential" });
}
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
     
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {

      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {

    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async(req,res) => {
    const user = await User.findById(req.user._id)
    if(user){
        res.json({
            _id : user._id,
            email : user.email,
            password : user.password,
            isAdmin : user.isAdmin,
        })
    }else{
        res.status(404);
        throw Error("User Not Found")
    }
}

export {getUserProfile, registerUser,loginUser,}