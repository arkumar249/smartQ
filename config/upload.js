const multer=require("multer");
const {CloudinaryStorage}=require("multer-storage-cloudinary");
const cloudinary=require("./cloudinary");


const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params: async (req , file)=>{
        const userId=req.user._id || "unknown";
        return {
            folder:`prescriptions/${userId}`,
            allowed_formats:['jpg' , 'jpeg' , 'png' , 'pdf'],
            public_id: `${Date.now()}-${file.originalname}`
        }
    }
})
const upload=multer({storage , 
    fileFilter: (req , file , cb)=>{
        const allowed_type=['image/jpg' , 'image/jpeg' , 'image/png' , 'application/pdf'];
        if(allowed_type.includes(file.mimetype)) cb(null , true);
        else cb(new Error("Invalid file type.") , false);
    }
})

module.exports=upload;