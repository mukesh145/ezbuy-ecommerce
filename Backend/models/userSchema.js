import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        maxLength: [50, "Name must be less that 50 characters"]
    },
    email: {
        type: String,
        required: [true, "please enter the email"],
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Your password must be longer than 6 characters"],
        select: false
    },
    type: {
        type: String,
        default: "User"
    },
    avatar: {
        public_id: String,
        url: String
    }
}, { timestamps: true })


userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

userSchema.methods.generateAuthToken = function () {

    const token = jwt.sign({ id: this._id }, process.env.SECRETE_KEY, {
        expiresIn: "7d"
    })
    return token
}




export default mongoose.model("User", userSchema)