'use client'
import client  from '@/api/client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthApiError } from '@supabase/supabase-js' // <-- import this

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
   const router = useRouter()
   const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value
 
     setFormError(null)
    // TODO: call Supabase signUp here
    // const { data, error } = await client.auth.signUp({ email, password })
    // if (error) return toast.error(error.message)
    // toast.success('Account created!')
    console.log({ email, password })
  if (!email || !password) {
      setFormError('Please enter email and password.')
      return
    }
    setSubmitting(true)  
     try {
    const {data, error} = await client.auth.signInWithPassword({
        email,
        password,
    });

    console.log(data);
    console.log(error)
    
   if(error){
        if(error instanceof AuthApiError){
       if (error.status === 400) {
            // Invalid credentials or unconfirmed email (depending on project settings)
            // If you want to detect unconfirmed specifically, inspect error.message.
            const isUnconfirmed = /confirm/i.test(error.message || '')
            setFormError(isUnconfirmed
              ? 'Please confirm your email before signing in.'
              : 'Invalid email or password.')
          } else if (error.status === 429) {
            setFormError('Too many attempts. Try again later.')
          } else if (error.status === 422) {
            setFormError('Please check your email and password.')
          } else {
            setFormError(error.message || 'Sign-in failed.')
          }
        } else {
          setFormError('Network error. Please try again.')
        }
        return // stop flow on error
      }
    if (!data?.session) {
        setFormError('Login failed. No session returned.')
        return
      }


    
    const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'SIGNED_IN', session: data.session }),
   })

  if (!res.ok) {
        const body = await res.text().catch(() => '')
        console.error('Failed to sync session cookies:')
        toast.error('Login succeeded, but session sync failed.')
        return
      }
  toast.success('Logged in!');
  router.replace('/dashboard');
     router.refresh()
    } catch (err) {
      console.error('Login unexpected error:', err)
      toast.error('Something went wrong. Please try again.')
    }
    
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className='bg-white/65 backdrop-blur-md mb-9'>
      <CardHeader>
        <CardDescription>Enter email and password to login</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
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
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
             {submitting ? 'Logging in…' : 'Log in'}
          </Button>

           {formError && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {formError}
            </p>
          )}
          
        </form>
      </CardContent>
    </Card>
  )
}

export default Login
