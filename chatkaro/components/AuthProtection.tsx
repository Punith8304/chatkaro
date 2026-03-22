"use client"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, } from "react"
import { useRouter } from "next/navigation"
import { RootState, AppDispatch } from "../lib/store"
import { loginUser } from "@/lib/user/userSlice"
import AuthLoading from "./checkingLoginStatus"


export default function ({ children, pathType }: {
    children: React.ReactNode,
    pathType: string
}) {
    const { login, checkingStatus } = useSelector((state: RootState) => state.userLogin)
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        if (checkingStatus === "idle") {
            dispatch(loginUser())
        }
    }, [dispatch])
    useEffect(() => {
        if (!login && checkingStatus === "success" && pathType === "chat") {
            router.replace("/login")
        }
        if (login && checkingStatus === "success" && pathType === "login") {
            router.replace("/chat")
        }
    }, [login, checkingStatus, router])
    if (checkingStatus === "idle" || checkingStatus === "loading" || (!login && pathType !== "login") || (login && pathType === "login")) {
        return <AuthLoading />
    }

    return <>{children}</>
}