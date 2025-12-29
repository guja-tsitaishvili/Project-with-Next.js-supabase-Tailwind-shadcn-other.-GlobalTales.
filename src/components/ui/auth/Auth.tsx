'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Login from './Login'
import Signup from './Signup'

const Auth: React.FC = () => {
  return (
  <div className="flex items-center justify-center min-h-screen">

     <div className="w-[340px] sm:w-[400px] rounded-[2rem]  p-6 text-center">
     
    <Tabs defaultValue="login" className="w-full " >
        <TabsList className="grid grid-cols-2 w-full bg-transparent mb-6 "
        >
        <TabsTrigger value="login"
         className="relative text-white text-lg font-light  after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 data-[state=active]:after:w-8 transition"
          style={{
    background: "none",
    boxShadow: "none",
  }}
         >Login
         </TabsTrigger>
        <TabsTrigger value="signup"
         className="relative text-white text-lg font-light  after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 data-[state=active]:after:w-8 transition"
         style={{
    background: "none",
    boxShadow: "none",
  }}
         >Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Login />
      </TabsContent>
      <TabsContent value="signup">
        <Signup />
      </TabsContent>
    </Tabs>
      </div>
    </div>
  )
}

export default Auth
