'use client'
import client  from '@/api/client'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const Login: React.FC = () => {
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value

    // TODO: call Supabase signUp here
    // const { data, error } = await client.auth.signUp({ email, password })
    // if (error) return toast.error(error.message)
    // toast.success('Account created!')
    console.log({ email, password })
    if(!email || !password ){
        toast.error('Please enter email and password');
    }

    const {data, error} = await client.auth.signInWithPassword({
        email,
        password,
    });

    console.log(data);
    console.log(error)
    if(data){
    toast.success('Success. Please login now.')
  }
   if(error){
    toast.error('Unable to login. Please try again.')
  }

  }
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter email and password to login</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="example@gmail.com"
              autoComplete="email"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Login
