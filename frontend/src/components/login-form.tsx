import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useGoogleLogin } from "@react-oauth/google"
import { showToast } from "@/utils/toastUtils"
import AuthService from "@/utils/authService"
import { useAppDispatch } from "@/store"
import { setCredentials } from "@/store/slices/authSlice"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      showToast.error("Please enter an email")
      return
    }

    setLoading(true)
    try {
      const res = await AuthService.sendOtp(email)
      showToast.success(res.message || "OTP sent to your email!")
      navigate("/verify-otp", { state: { email } })
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      showToast.error(message || "Failed to send OTP or Network Error")
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true)
        const res = await AuthService.googleLogin(tokenResponse.access_token)
        dispatch(setCredentials({ token: res.token, user: res.user }))
        showToast.success("Successfully logged in with Google!")
        navigate("/dashboard")
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message
        showToast.error(message || "Google Login Failed on Server or Network error")
      } finally {
        setLoading(false)
      }
    },
    onError: () => {
      showToast.error("Google Sign In Failed")
    }
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSendOtp} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome to Docables</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email to log in or create an account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending OTP..." : "Continue with Email"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="mt-4 flex w-full justify-center">
                <Button variant="outline" type="button" onClick={() => loginWithGoogle()} disabled={loading} className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </Field>
              <FieldDescription className="text-center">
                New here? Continuing with email creates your account automatically.
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 text-white md:flex">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter">Docables</h2>
              <p className="text-lg font-medium text-white/80">
                Private notes, public links when you want them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By continuing, you agree to our{" "}
        <Link to="/about" className="underline underline-offset-4">terms of use</Link>.
      </FieldDescription>
    </div>
  )
}
