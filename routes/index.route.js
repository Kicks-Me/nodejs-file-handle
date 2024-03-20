import Route from 'express';
import { verifyJWT } from '../helper/jwt.js';
import { handleMultipleFiles, upload } from '../helper/multer.js';
import FormData from 'form-data';
const route = Route();

route.post('/employee',verifyJWT, upload.single('Profile'), upload.array('Images', 5), handleMultipleFiles, (req, res) => {
    const profileImage = req.newImages.Profile;
    const Images = req.newImages.newImages;
  
    return res.json({ profileImage, Images });
  });

  export const postUploads = upload.fields([
    {
        name: "fileUpload",
        maxCount: 1,
    },
    {
        name: "fileUploadThumbnail",
        maxCount: 1,
    },
  ]);

route.post('/location', (req,res)=>{
  postUploads(req, res, async (error) => {
    if (error instanceof MulterError) {
        return res.status(400).json({
            resultCode: 400,
            resultDesc: error.message,
            detail: null,
        });
    }
    else if (error instanceof Error) {
        return res.status(400).json({
            resultCode: 400,
            resultDesc: error.message,
            detail: null,
        });
    }

  const images = req?.files;
  res.json({image: images})

});
});

export default route;