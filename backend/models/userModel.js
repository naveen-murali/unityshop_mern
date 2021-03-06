import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const addressSchema = mongoose.Schema({
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    postalCode: {
        type: String,
        required: false,
    },
    contry: {
        type: String,
        required: false,
    },
});

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        referralNum: {
            type: Number,
            required: true,
            default: 0
        },
        googleId: {
            type: String,
            require: false
        },
        wallet: {
            type: Number,
            required: true,
            default: 0
        },
        password: {
            type: String,
            required: false,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false
        },
        address: [addressSchema]
    },
    {
        timestamps: true
    }
);

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        next();

    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;