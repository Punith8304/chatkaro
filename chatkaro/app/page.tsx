"use client"

import { useRouter } from "next/navigation"
import { useEffect, useLayoutEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { loginUser } from "@/lib/user/userSlice"
import {type RootState, type AppDispatch} from "../lib/store"

export default function Home() {
  const router = useRouter()
  const login = useSelector((state: RootState) => state.userLogin.login)
  const dispatch = useDispatch<AppDispatch>()
  useLayoutEffect(() => {
    
    if (login) {
      router.push("/chat")
    } else {
      router.push("/login")
    }
  }, [login])

  useEffect(() => {
    // Check if user has a session ID (meaning they're logged in)
    dispatch(loginUser())
  }, [])
  return (
    <div>
      Redirecting...
    </div>
  )
}