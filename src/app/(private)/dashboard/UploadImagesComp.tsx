// app/(private)/dashboard/UploadImages.tsx
"use client"
import Image from "next/image"
import { ChangeEvent, useEffect, useRef, useState, useTransition } from 'react'
import { convertBlobUrlToFile } from "@/lib/utils"
import { uploadImage } from "@/api/storage/client"
import client from "@/api/client"
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type Obj = { name: string; url: string; path: string }


export default function UploadImagesComp() {
   const [imageUrls, setImageUrls] = useState<string[]>([])
   const [items, setItems] = useState<Obj[]>([])  
   const imageInputRef = useRef<HTMLInputElement>(null)

    //AI + 
    useEffect(() => {
    void refreshGallery()
  }, [])
    //AI  - +
     async function refreshGallery() {
    const { data: auth } = await client.auth.getUser()
    const user = auth?.user
    if (!user) return

    const { data: list, error } = await client.storage
      .from('posts')
      .list(user.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

    if (error) {
      console.error('list error:', error)
      setItems([])
      return
    }
     const rows: Obj[] = []
    for (const o of (list ?? [])) {
      const path = `${user.id}/${o.name}`
      const { data } = await client.storage
       .from('posts')
       .getPublicUrl(path) // 60s signed URL

    rows.push({
    name: o.name,
    url: data.publicUrl ?? '',
    path,
  })
}
setItems(rows)
  }
     //AI - 

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

    const { data, error } = await client.auth.getUser()
      if (error || !data.user) {
        console.error("User not logged in", error)
        return
      }
      const user = data.user
    for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url)

     const {path, error} = await uploadImage({
        file: imageFile, 
        bucket: 'posts',
        folder: user.id, //each user has its own folder
     });

     if(error){
        console.error(error);
        console.log("this error must be shown" + error);
        return
     }

    }
    setImageUrls([])
    await refreshGallery()
    toast.success('Uploaded!')
})
   }

  async function onDelete(path: string) {
    const { error } = await client.storage.from('posts').remove([path])
    if (error) {
      toast.error(error.message)
      return
    }
    await refreshGallery()
    toast.success('Deleted')
  }   
 
  return (
    <div className='flex justify-center items-center flex-col gap-8'>
      <input 
      type="file" 
      hidden 
      ref={imageInputRef}  
      multiple 
      onChange={handleImageChange}
      disabled = {isPending}
      />
       <div className="flex gap-3">
         <button 
         className="bg-slate-600 py-2 w-40 rounded-lg"
         onClick={() => imageInputRef.current?.click()}
         disabled={isPending}
         >
            Select images
            </button>
           
      <button
        onClick = {handleClickUploadImagesButton}
         className="bg-slate-600 py-2 w-40 rounded-lg">
         {isPending ? "Uploading..." : "Upload Images"}
        </button>
    </div>
       {imageUrls.length > 0 && (
         <>
          <div className="text-sm opacity-70">Previews (not uploaded yet)</div>
          <div className="flex flex-wrap gap-4">
       {imageUrls.map((u) => (
          <Image key={u} src={u} alt="imageUrls" width={150} height={150} className="rounded-md object-cover" />
       ))}
    </div>

    </>
  )
}
  <div className="w-full">
        <div className="mb-2 text-sm opacity-70">Your images</div>
        {items.length === 0 ? (
          <div className="text-sm opacity-60">No images yet.</div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {items.map((it) => (
              <div key={it.path} className="space-y-2">
                <Image src={it.url} alt={it.name} width={180} height={180} className="rounded-md object-cover" />
                <Button variant="secondary" onClick={() => onDelete(it.path)}>Delete</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
