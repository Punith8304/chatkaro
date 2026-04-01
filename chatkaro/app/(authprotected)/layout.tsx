import AuthGaurd from "@/components/AuthProtection"

export default function AuthGaurdLayout({ children }: { children: React.ReactNode }) {
    console.log("ayth layout")
    return <AuthGaurd pathType="chat">{children}</AuthGaurd>
}