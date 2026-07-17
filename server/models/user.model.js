import { Schema, model } from 'mongoose'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        minLength: [3, "At least 3 characters required"],
        maxLength: [50, "Name must not exceed 50 characters"],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        unique: true,
        // match: [/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, 'Please enter a valid email address'] 

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"],
        select: false
    },
    avatar: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: "USER"
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
        id: String,
        status:String
    }

}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods = {
    generateJWTToken: async function () {
        return jwt.sign(
            {
                id: this._id,
                email: this.email,
                subscription: this.subscription,
                role: this.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    },
    comparePassword: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password)
    },
    generatePasswordResetToken: async function name() {
        const resetToken = crypto.randomBytes(20).toString('hex')

        this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.forgotPasswordExpiry = Date.now() + 5 * 60 * 1000;

        return resetToken
    }
}

const User = model("User", userSchema)

export default User