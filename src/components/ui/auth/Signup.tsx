'use client'
import client  from '@/api/client'
import React, { useState } from 'react'
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
import { AuthApiError } from '@supabase/supabase-js'
import {mapSignUPError, uiMessage, validateEmail, validatePassword } from './errornormiliser'

const Signup: React.FC = () => {

   const [formError, setFormError] = useState<string | null>(null) 
   const [loading, setLoading] = useState(false)
const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value


      setFormError(null)
    setFormSuccess(null)

    console.log({ email, password })
    if(!email || !validateEmail(email) ){
       setFormError(uiMessage('invalid-email'))
      return
    }

 if (!password || !validatePassword(password)) {
      setFormError(uiMessage('weak-password'))
      return
    }


    setLoading(true)
    try{
    const {data, error} = await client.auth.signUp({
        email,
        password,
    });

    if(data && !error){
    toast.success('Success. Please login now.')
  }
   if(error){
      const code = mapSignUPError(error as { message: string })
      setFormError(uiMessage(code))
      return
  }
if (!data?.session) {
      toast.success('Check your email to confirm your account.')
    } else {
      toast.success('Signed up successfully!')
    }
  } catch (err) {
    toast.error('Unable to sign up. Please try again.')
  } finally {
    setLoading(false)
  }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Enter email and password to sign up</CardDescription>
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
         <div className="min-h-6">
            {formError && (
              <p className="text-sm text-red-600" role="alert" aria-live="polite">
                {formError}
              </p>
            )}
            {formSuccess && (
              <p className="text-sm text-emerald-600" role="status" aria-live="polite">
                {formSuccess}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Signup
