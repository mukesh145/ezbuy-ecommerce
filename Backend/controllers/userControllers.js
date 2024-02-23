import User from "../models/userSchema.js"
import ErrorHandler from "../utils/errorHandler.js"
import sendToken from "../utils/sendToken.js"



//register user
export const registerUser = async (req, res, next) => {
    const user = await User.create(req.body)

    sendToken(user, 201, res)
}



//login the user
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler("user Id and password are required", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
        return next(new ErrorHandler("Wrong email Id or Password",401))
    }
    
    sendToken(user, 200, res)

}


//logout user
export const logout = async (req, res, next) => {


    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        status: "logged Out"
    })
}

//get user details
export const getProfile = async (req, res, next) => {
    res.status(200).json(
        req.user
    )
}

//update user password
export const updatePassword = async (req, res, next) => {
    const {oldPassword, newPassword} = req.body

    if(!oldPassword || !newPassword){
        return next(new ErrorHandler("enter Old password and the new Password",400))
    }

    const user = await User.findById(req.user._id).select("+password")
    const isMatch = await user.comparePassword(oldPassword)

    if (!isMatch) {
        return next(new ErrorHandler("Wrong Password"), 401)
    }

    user.password = newPassword
    user.save()

    res.status(200).json({
        success : true
    }
    )
}


//update profile
export const updateProfile = async (req, res, next) => {
    const {name , email} = req.body
    const user = await User.findByIdAndUpdate(req.user._id ,{name , email} , {new : true})
    res.status(200).json({
        user
    }
    )
}


//get user details -- ADMIN route
export const getDetails = async (req, res, next)=>{
    const userDetails = await User.findById(req.params.id)
    res.status(200).json({
        userDetails
    })
}

//update user -- ADMIN route
export const updateUser = async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      type: req.body.type,
    };
  
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
    });
  
    res.status(200).json({
      user,
    });
  }
  


//delete use --ADMIN route
export const deleteUser = async (req, res, next)=>{
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler("user dosent exist", 401));
    }   

    await user.deleteOne()
    
    console.log("user deleted");
    res.status(200).json({
        success : true
    })
}
