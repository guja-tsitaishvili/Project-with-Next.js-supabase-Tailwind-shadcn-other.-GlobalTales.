import {v4 as uuid} from 'uuid'
import imageCompression from 'browser-image-compression'
import  client  from '../client'

function getStorage(){
  
  return client.storage
}

type UploadProps = {
    file: File;
    bucket: string;
    folder?: string;
}


export async function uploadImage({file, bucket, folder}: UploadProps) {
    const fileName = file.name
    const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1)
    const path = `${folder ? folder + "/" : "" }${uuid()}.${fileExtension}`


try {
    file = await imageCompression(file, {
        maxSizeMB: 1
    })
}  catch(error){
    console.error(error)
    return {imageUrl:"", error:"Image compression failed"}
}

const storage = getStorage()

const {data, error} = await storage.from(bucket).upload(path, file)


 if (error) {
  console.error("Supabase upload error:", error.message, error)
  return { imageUrl: "", error: error.message }
}

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}` 

  return {imageUrl, error: ""};
}