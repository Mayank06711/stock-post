import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import fs from "fs";

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Uploading cloudinary failed because no local path found");
      return null;
    }
    // uploading on clooudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: uuid(),
    });

    // delete file from local storage
    fs.unlinkSync(localFilePath);
    console.log(`file is being uploaded on cloudinary from line number 24`);
    return (res = {
      url: response.secure_url,
      public_Id: response.public_id,
    });
  } catch (error) {
    console.log(
      "upload error I`m from cloudinaryfileUpload  : also see where i have been used ",
      error,
      "----------- \n --------",
      error.message
    );
    // delete file from local path
    fs.unlinkSync(localFilePath);
    return null;
  }
}; //Upload filesingle file on cloudinary

const deleteImageFromCloudinary = async (oldFilePublic_Id) => {
  // will be usd when deleting an yser its avtar needs to be deleted from serveer
  try {
    if (!oldFilePublic_Id) {
      console.log(
        "deletion failed from deleteImageFromCloudinary not found path: oldPath: " +
          oldFilePublic_Id
      );
      return null;
    }
    // getting path from oldfilepublicid
    const public_id = oldFilePublic_Id.split("/").pop().split(".")[0];
    console.log("From deleteImageFromCloudinary public_id", public_id);
    const res = await cloudinary.uploader.destroy(public_id, {
      invalidate: true,
      resource_type: "raw",
    });
    console.log(
      "File deleted on cloudinary",
      oldFilePublic_Id,
      "public_id",
      public_id
    );
    return res;
  } catch (error) {
    console.log(
      "error deleting from cloudinary lin number 41 approx \n error",
      error
    );
    return null;
  }
};

export { uploadOnCloudinary, deleteImageFromCloudinary };
