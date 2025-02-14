
import express,{Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from"./routes/MyRestaurantRoute";
import {v2 as cloudinary}  from "cloudinary";
import restuarantRoute from "./routes/RestaurantRoute";


const app = express();
app.use(express.json());
app.use(cors())


app.get("/health", async(req: Request, res: Response) => {
    res.send({message: "health OK!"});

})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to our database"));

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant",myRestaurantRoute);
app.use("/api/restaurant/", restuarantRoute);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


//J5ffyWx9r1vG0mQn


app.listen(7000, () => {
    console.log("server started on localhost:7000");
})
