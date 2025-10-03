"use client"
import
{ 
    Dialog,
    DialogOverlay,
    DialogContent,   
    DialogTitle 
 } from "./dialog"

 import { useRouter } from "next/navigation"
 
 export function Modal({
     children, 
 }
  :
  { 
    children: React.ReactNode
  }){
  const router = useRouter()

  const handleOpenChange = () => {
    router.back()
  }
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
           <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm">
           <DialogTitle></DialogTitle>
               <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6  max-w-2xl w-full z-50"> 
                        {children}
               </DialogContent>
           </DialogOverlay>
    </Dialog>
  )
  }