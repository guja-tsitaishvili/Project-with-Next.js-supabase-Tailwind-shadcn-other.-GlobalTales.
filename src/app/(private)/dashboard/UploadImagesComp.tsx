// app/(private)/dashboard/UploadImages.tsx
"use client"
import Image from "next/image"
import { ChangeEvent, useRef, useState, useTransition } from 'react'
import { convertBlobUrlToFile } from "@/lib/utils"
import { uploadImage } from "@/api/storage/client"
import client from "@/api/client"

export default function UploadImagesComp() {
   const [imageUrls, setImageUrls] = useState<string[]>([])

  const imageInputRef = useRef<HTMLInputElement>(null)
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const filesArray = Array.from(e.target.files)
            const newImageUrls = filesArray.map((file) => URL.createObjectURL
             (file));

             setImageUrls([...imageUrls, ...newImageUrls])
        }
    };
      const [isPending, startTransition] = useTransition()

   const handleClickUploadImagesButton = async () => {
startTransition(async () => {
    const urls = []

    const { data, error } = await client.auth.getUser()
      if (error || !data.user) {
        console.error("User not logged in", error)
        return
      }
      const user = data.user
    for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url)

     const {imageUrl, error} = await uploadImage({
        file: imageFile, 
        bucket: 'profile-avatars',
        folder: user.id, //each user has its own folder
     });

     if(error){
        console.error(error);
       console.log("this error must be shown" + error);
        return
     }
      urls.push(imageUrl)


      // update prfile in supabase
        const { error: updateError } = await client  
         .from("profiles")
        .upsert({ id: user.id, avatar_url: imageUrl }, { onConflict: "id" })

   
       if (updateError) {
        console.error("Failed to update profile:", updateError)
      }
    }
    setImageUrls(urls)
})
   }
 
  return (
    <div className='flex justify-center items-center flex-col gap-8'>
        <Image  
                  src="https://juioxkzmhtpcsddlskpi.supabase.co/storage/v1/object/public/profile-avatars/e34f724e-38d0-416f-ab86-e12541bcffc4/7038b4ae-e0c8-4df8-9295-b03e57f7683e.jpeg"
                  width={300}
                  height={300}
                  alt={`img-dank`}
                  />
      <input 
      type="file" 
      hidden 
      ref={imageInputRef}  
      multiple 
      onChange={handleImageChange}
      disabled = {isPending}
      />
         <button 
         className="bg-slate-600 py-2 w-40 rounded-lg"
         onClick={() => imageInputRef.current?.click()}
         disabled={isPending}
         >
            Select images
            </button>
            <div className='flex gap-4'>
                {imageUrls.map((url, index) => (
                  <Image  
                  key = {url}
                  src = {url}
                  width={300}
                  height={300}
                  alt={`img-${index}`}
                  />
                ))}
            </div>
      <button
        onClick = {handleClickUploadImagesButton}
         className="bg-slate-600 py-2 w-40 rounded-lg">
         {isPending ? "Uploading..." : "Upload Images"}
        </button>
    </div>
  )
}
