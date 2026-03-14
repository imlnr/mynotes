import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'

import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { showToast } from '@/utils/toastUtils'
import api from '@/utils/axios'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

export default function VerifyOtp() {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

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
            return;
        }

        setLoading(true)
        try {
            const res = await api.post('/auth/verify-otp', { email, otp })

            if (res.status === 200) {
                showToast.success('Successfully logged in!')
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                navigate('/')
            }
        } catch (err: any) {
            console.error(err)
            showToast.error(err.response?.data?.message || 'Invalid OTP or Network Error')
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
                                <div className="flex flex-col items-center gap-2 text-center pb-4">
                                    <h1 className="text-2xl font-bold">Verify OTP</h1>
                                    <p className="text-balance text-muted-foreground">
                                        Enter the 6-digit code sent to <br />
                                        <span className="font-semibold text-foreground">{email}</span>
                                    </p>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="otp" className="text-center w-full">One-Time Password</FieldLabel>
                                    <Input
                                        id="otp"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="123456"
                                        className="text-center text-lg tracking-widest h-12"
                                        value={otp}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                                        required
                                    />
                                </Field>
                                <Field className="pt-2">
                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? 'Verifying...' : 'Verify & Login'}
                                    </Button>
                                    <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => navigate('/login')}>
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
