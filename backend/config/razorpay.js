
import Razorpay from 'razorpay';

export let razorpay;

export const setRazorpay = () => {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });
};