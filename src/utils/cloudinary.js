import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const cloudUploade = async (fileToUpload) =>{
    try{
        const imageUploade = await cloudinary.uploader.upload(fileToUpload)
        return imageUploade
    }
    catch(error){
        return error
    }
}
export const cloudRemove = async (publicId) =>{
    try{
        const imageRemove = await cloudinary.uploader.destroy(publicId)
        return imageRemove
    }
    catch(error){
        return error
    }
}