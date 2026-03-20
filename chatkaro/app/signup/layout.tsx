"use client"

import { useSelector } from 'react-redux';
import { RootState } from "../../lib/store"
import { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupLayout({ children }: {
    children: React.ReactNode
}) {
    const login = useSelector((state: RootState) => state.userLogin.login)
    const router = useRouter()
    useLayoutEffect(() => {
        if (login) {
            router.push("/chat")
        }
    }, [login])
    return <>{ children }</>
}