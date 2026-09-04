import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { showToast } from '@/utils/toastUtils'
import AuthService from '@/utils/authService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store'
import { setCredentials } from '@/store/slices/authSlice'

export default function VerifyOtp() {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()

    const email = location.state?.email || ''

    useEffect(() => {
        if (!email) {
            showToast.error('Session expired. Please login again.')
            navigate('/login')
        }
    }, [email, navigate])

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otp) {
            showToast.error('Please enter the OTP')
            return
        }

        setLoading(true)
        try {
            const res = await AuthService.verifyOtp(email, otp)
            dispatch(setCredentials({ token: res.token, user: res.user }))
            showToast.success('Successfully logged in!')
            navigate('/dashboard')
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message
            showToast.error(message || 'Invalid OTP or Network Error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0">
                        <form onSubmit={handleVerifyOtp} className="p-6 md:p-8">
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 pb-4 text-center">
                                    <h1 className="text-2xl font-bold">Verify OTP</h1>
                                    <p className="text-balance text-muted-foreground">
                                        Enter the 6-digit code sent to <br />
                                        <span className="font-semibold text-foreground">{email}</span>
                                    </p>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="otp" className="w-full text-center">One-Time Password</FieldLabel>
                                    <Input
                                        id="otp"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="123456"
                                        className="h-12 text-center text-lg tracking-widest"
                                        value={otp}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </Field>
                                <Field className="pt-2">
                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? 'Verifying...' : 'Verify & Login'}
                                    </Button>
                                    <Button type="button" variant="ghost" className="mt-2 w-full" onClick={() => navigate('/login')}>
                                        Back to Login
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
