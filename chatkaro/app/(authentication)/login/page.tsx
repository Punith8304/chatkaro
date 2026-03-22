"use client"

import Link from 'next/link';
import './login.css';
import React, { useTransition, useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../../lib/store";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { changeLogin, loginUser } from '@/lib/user/userSlice';



export default function Login() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState({
        isError: false,
        errorMessage: ""
    })
    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: ""
    })
    const login = useSelector((state: RootState) => state.userLogin.login)
    const api = useSelector((state: RootState) => state.api)
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const controller = new AbortController()
    let anyAPIRunning = false
    // useEffect(() => {
        
    //     if (login) {
    //         router.push("/chat")
    //     }
    // }, [login])
    // useEffect(() => {
    //     dispatch(loginUser())
    // }, [])

    function handleLoginForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (anyAPIRunning) {
            controller.abort()
        }
        startTransition(async () => {
            anyAPIRunning = true
            const result = await axios.post(`${api}/authentication/login`, loginDetails, { signal: controller.signal, withCredentials: true })
            console.log(result.data)
            if (!result.data.userExists || !result.data.userLogged) {
                setError({
                    isError: true,
                    errorMessage: "Invalid username or password"
                })
            } else {
                dispatch(changeLogin({login: true, userName: result.data.user.userName}))
                router.replace("/chat")
            }

        })
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setLoginDetails(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <h1>Sign In</h1>
                </div>

                <form action="post" className="login-form" onSubmit={handleLoginForm}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={handleChange}
                            placeholder="Enter your username"
                            value={loginDetails.username}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            placeholder="Enter your password"
                            value={loginDetails.password}
                            required
                        />
                    </div>


                    <div>
                        {error.isError ? <p className='error-message'>{error.errorMessage}</p> : null}

                        <button type="submit" className="login-button">
                            {isPending ? "Signing in" : "Sign In"}
                        </button>
                    </div>
                </form>

                <Link href="/signup" className="signup-link">Don't have an account? Sign up</Link>
            </div>
        </div>
    );
}