import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(` MongoDB Connected: [ ${connect.connection.host} ]`.blue.underline.bold);
    } catch (err) {
        console.error(`Mongo Error: ${err.message}`.red.underline.bold);
        process.exit(1);
    } finally {
        console.log(`---------------------------------------------------------------------------------\n`);
    }
};

// , {
//     useUnifiedTopology: true,
//     useUrlParser: true,
//     useCreateIndex: true
// }