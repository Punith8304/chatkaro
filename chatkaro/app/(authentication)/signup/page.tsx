"use client"


import React, { useTransition, useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/lib/store";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { changeLogin, loginUser } from '@/lib/user/userSlice';
import Link from 'next/link';

import './signup.css';

export default function Signup() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState({
    isError: false,
    errorMessage: ""
  })
  const [signupDetails, setSignupDetails] = useState({
    username: "",
    useremail: "",
    password: ""
  })
  const api = useSelector((state: RootState) => state.api)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const controller = new AbortController()
  let anyAPIRunning = false


  function handleSignupForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (anyAPIRunning) {
      controller.abort()
    }
    startTransition(async () => {
      anyAPIRunning = true
      const result = await axios.post(`${api}/authentication/sign-up`, signupDetails, { signal: controller.signal, withCredentials: true })
      console.log(result.data)
      if (result.data.userExists) {
        setError({
          isError: true,
          errorMessage: "user already exists"
        })
      } else if (result.data.userLogged) {
        dispatch(changeLogin({ login: true, userName: result.data.createdUser.userName, checkingStatus: "success" }))
        router.replace("/chat")
      } else {
        setError({
          isError: true,
          errorMessage: ""
        })
      }

    })
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setSignupDetails(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }
  return (
    <div className="signup-positioner">
      <div className="terminal-auth-flow">
        {/* Terminal Header */}
        <div className="cli-header">
          <span className="user-prefix">root@chatkaro:</span>
          <span className="path">/etc/nodes</span>
          <span className="prompt-char">#</span>
          <span className="command"> useradd --interactive</span>
        </div>

        {/* System Info Message */}
        <div className="system-msg">
          <span className="term-blue">[INFO]</span> Initializing new user configuration script...
        </div>

        {/* Signup Form */}
        <form className="cli-form" onSubmit={handleSignupForm}>
          <div className="input-row">
            <span className="label">NEW_EMAIL:</span>
            <input
              type="email"
              name="useremail"
              placeholder="dev@null.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-row">
            <span className="label">NEW_IDENTIFIER:</span>
            <input
              type="text"
              name="username"
              placeholder="choose_username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-row">
            <span className="label">NEW_SECURE_KEY:</span>
            <input
              type="password"
              name="password"
              placeholder="********"
              onChange={handleChange}
              required
            />
          </div>

          {/* Error Rendering Slot */}
          {error?.isError && (
            <div className="terminal-error">
              <span className="error-prefix">[ERR]:</span>
              {error.errorMessage || "REGISTRATION_INTERRUPTED"}
            </div>
          )}

          <button type="submit" className="signup-btn">
            {isPending ? "STATUS: PROVISIONING..." : "PROVISION_NEW_USER"}
          </button>
        </form>

        {/* Terminal Footer Navigation */}
        <div className="cli-footer">
          <span className="dimmed">Existing node detected?</span>
          <Link href="/login" className="link"> cd ../login</Link>
        </div>
      </div>
    </div>
  );
}