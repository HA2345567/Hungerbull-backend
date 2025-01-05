import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

// Ensure cloudinary is configured
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getMyRestaurant = async( req: Request,res: Response)=> {
    try{
        const restaurant = await Restaurant.findOne({user: req.userId});
        if(!restaurant){
            return res.status(404).json({message: " resaturant not found"});
        }
        res.json(restaurant);

    }catch(error){
        console.log("error", error);
        res.status(500).json({message: "Error fetching restaurant"});
    }
}

const createMyRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if userId is set
        if (!req.userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        // Log userId
        console.log("User ID:", req.userId);

        // Check if restaurant already exists for the user
        const existingRestaurant = await Restaurant.findOne({ user: req.userId });
        if (existingRestaurant) {
            res.status(409).json({ message: "User restaurant already exists" });
            return;
        }

        // // Check if image file is provided
        // const image = req.file as Express.Multer.File;
        // if (!image) {
        //     res.status(400).json({ message: "Image file is required" });
        //     return;
        // }

        // // Convert image to base64 and upload to Cloudinary
        // const base64Image = Buffer.from(image.buffer).toString("base64");
        // const dataURI = `data:${image.mimetype};base64,${base64Image}`;
        // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        // Create new restaurant document


        const imageUrl =  await uploadImage(req.file as Express.Multer.File);
        const restaurant = new Restaurant({
            ...req.body,
            imageUrl: imageUrl,
            user: new mongoose.Types.ObjectId(req.userId),
            lastUpdated: new Date(),
        });

        // Save restaurant to the database
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (error) {
        console.error("Error creating restaurant:", error); // More detailed error logging
        res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
    }
};
const updateMyRestaurant = async (req: Request, res: Response)=> {
    try{
        const restaurant = await Restaurant.findOne({user: req.userId});
        if(!restaurant){
            return res.status(404).json({message:"Restaurant not found"});
        }
        restaurant.restaurantName = req.body.restaurantName;
        restaurant.city = req.body.city;
        restaurant.country = req.body.country;
        restaurant.deliveryPrice = req.body.deliveryPrice;
        restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurant.cuisines = req.body.cuisines;
        restaurant.menuItems = req.body.menuItems;
        restaurant.lastUpdated = new Date();

        if(req.file){
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;

        }

        await restaurant.save();
       res.status(200).send(restaurant);

    }catch(error){
        console.log("error", error);
        res.status(500).json({message: "Error updating restaurant"});
    }
};

const uploadImage = async (file: Express.Multer.File)=>{
    const image = file;

    // Convert image to base64 and upload to Cloudinary
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;

}

export default {
    updateMyRestaurant,
    getMyRestaurant,
    createMyRestaurant,
};