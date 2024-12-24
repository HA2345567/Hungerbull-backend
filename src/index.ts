
import express,{Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

const app = express();
app.use(express.json());
app.use(cors())


app.get("/health", async(req: Request, res: Response) => {
    res.send({message: "health OK!"});

})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to our database"));

app.use("/api/my/user", myUserRoute);


//J5ffyWx9r1vG0mQn


app.listen(7000, () => {
    console.log("server started on localhost:7000");
})