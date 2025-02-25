import { Injectable } from '@nestjs/common';
import { v2 as cloudinary,UploadApiOptions} from 'cloudinary';
import * as dotenv from "dotenv";
@Injectable()
export class CloudinaryService {
    constructor(){
        dotenv.config({path:".env"});
        cloudinary.config({
            cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
            api_key:process.env.CLOUDINARY_CLOUD_API_KEY,
            api_secret:process.env.CLOUDINARY_CLOUD_API_SECRET
        })
    }



    async uploadFile(buffer:Buffer, originalName?:string) :Promise<string>{
        const options: UploadApiOptions = {
        folder : "uploads",
        public_id: originalName,
        resource_type: "auto",
        };
        
        return new Promise( (resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream(
        options,
        (error,result)=>{
       if (error) {
       reject (error);
       } else if (result && result.secure_url){
       resolve (result.secure_url);
    } else {
        reject (new Error ('Upload failed, result is undefined or missing secure_url'));
                }
            },
        );
        stream.write(buffer);
        stream.end();
            });
        }
    
        async getUrl(publicId:string):Promise<string>{
            const result = cloudinary.api.resource(publicId);
            return result;
            }
    
    
    


}