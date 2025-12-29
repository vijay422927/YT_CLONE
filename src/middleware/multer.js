import multer from "multer";
const storage=multer.diskStorage(
    {
        destination:function(req,file,cb)
        {
            cb(null,"uploads");
        },
        filename:function(req,file,cb)
        {
            cb(null,file.originalname)
        }
    }
)

const fileFilter=(req,file,cb)=>
{
    const allowedMimeTypes = [
        
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",

      
        "video/mp4",
        "video/webm",
        "video/quicktime", 
        "video/x-matroska" 
    ];

    if(allowedMimeTypes.includes(file.mimetype))
    {
        cb(null,true)
    }
    else
    {
        cb(new Error("image files are accepted only"),false)
    }
};
export const uploads=multer({storage,fileFilter});