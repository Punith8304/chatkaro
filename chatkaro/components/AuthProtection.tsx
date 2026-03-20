"use client"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, } from "react"
import { useRouter } from "next/navigation"
import { RootState, AppDispatch } from "../lib/store"
import { loginUser } from "@/lib/user/userSlice"
import AuthLoading from "./checkingLoginStatus"


export default function ({ children }: {
    children: React.ReactNode
}) {
    const { login, checkingStatus } = useSelector((state: RootState) => state.userLogin)
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    // useEffect(() => {
    //     if (checkingStatus === "idle") {
    //         dispatch(loginUser())
    //     }
    // }, [checkingStatus, dispatch])
    // useEffect(() => {
    //     if (!login && checkingStatus === "success") {
    //         router.replace("/login")
    //     }
    // }, [login, checkingStatus, router])
    if(checkingStatus === "idle" || checkingStatus === "loading" || !login || true) {
        return <AuthLoading />
    }

    return <>{children}</>
}