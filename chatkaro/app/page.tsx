"use client"

import { useRouter } from "next/navigation"
import { useEffect, useLayoutEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { loginUser } from "@/lib/user/userSlice"
import { type RootState, type AppDispatch } from "../lib/store"
import AuthLoading from "@/components/checkingLoginStatus"

export default function Home() {
  const { login, checkingStatus } = useSelector((state: RootState) => state.userLogin)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  useEffect(() => {
    if (!login && checkingStatus === "idle") {
      dispatch(loginUser())
    }
  }, [dispatch])
  useEffect(() => {
    if (!login && checkingStatus === "success") {
      router.replace("/login")
    } else if(login && checkingStatus === "success") {
      router.replace("/chat")
    }
  }, [checkingStatus, login])
  
    return (
      <AuthLoading />
    )
}