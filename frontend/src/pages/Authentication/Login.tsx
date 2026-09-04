import { Navigate } from "react-router-dom"
import { LoginForm } from "@/components/login-form"
import { useAppSelector } from "@/store"

export default function Login() {
    const token = useAppSelector((state) => state.auth.token)

    if (token) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-3xl">
                <LoginForm />
            </div>
        </div>
    )
}
