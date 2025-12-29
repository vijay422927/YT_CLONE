import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("Local file path missing");
        }

        const response = await cloudinary.uploader.upload(
            localFilePath,
            { resource_type: "auto" }
        );

        // delete local file ONLY after success
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error(" Cloudinary error:", error.message);

        // delete file only if it exists
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        throw error; 
    }
};

export { uploadCloudinary };
