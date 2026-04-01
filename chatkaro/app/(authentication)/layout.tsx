import AuthGaurd from "@/components/AuthProtection"

export default function AuthGaurdLayout({ children }: { children: React.ReactNode }) {
    return <AuthGaurd pathType="login">
        {children}
        </AuthGaurd>
}