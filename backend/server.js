import express from 'express';
import cors from 'cors';
import 'dotenv/config';
//import { auth, storage } from './config/firebase.js'; // Import both auth and storage
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB(); // Connect to MongoDB
//console.log(auth); // Check if Firebase auth object is imported correctly
//console.log(storage); // Check if Firebase storage object is imported correctly

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/', (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log('Server started on PORT: ' + port));
