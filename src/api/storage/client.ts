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
    const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1) //this retruns file extension name jpg for exmpl.
    const path = `${folder ? folder + "/" : "" }${uuid()}.${fileExtension}`


try {
    file = await imageCompression(file, 
        { maxSizeMB: 1}
    )
}  catch(error){
    console.error(error)
    return {imageUrl:"", error:"Image compression failed"}
}

const storage = getStorage()
                                                                    //overwrite enabled (safer)
const {data, error} = await storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type })


 if (error) {
  console.error("Supabase upload error:", error.message, error)
  return { path: "", error: error.message }
}

  

  return { path: data?.path ?? path, error: '' } //use to have public url here but changed it becouse bucket is private now 
}