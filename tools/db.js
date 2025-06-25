import { connect } from 'mongoose';
import 'dotenv/config';

export async function connectDB() {
    await connect(process.env.MONGODB_URI);
}
