import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
    url: string;
    publicId: string;
}

export const uploadLogo = async (
    base64Image: string,
    fileName: string
): Promise<UploadResult> => {
    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "brandai/logos",
            public_id: fileName,
            resource_type: "image",
            transformation: [
                { width: 1024, height: 1024, crop: "limit" },
                { quality: "auto" },
                { format: "png" },
            ],
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image to storage");
    }
};

export const deleteLogo = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        throw new Error("Failed to delete image from storage");
    }
};

export { cloudinary };
