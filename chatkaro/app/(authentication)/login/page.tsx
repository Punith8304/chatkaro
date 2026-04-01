"use client"

import Link from 'next/link';
import './login.css';
import React, { useTransition, useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/lib/store";
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
            if (!result.data.userExists) {
                setError({
                    isError: true,
                    errorMessage: "No user found"
                })
            } else if( !result.data.userLogged) {
                setError({
                    isError: true,
                    errorMessage: "Password incorrect"
                })
            } else {
                dispatch(changeLogin({ login: true, userName: result.data.user.userName }))
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
        <div className="login-positioner">
            <div className="terminal-auth-flow">
                <div className="cli-header">
                    <span className="user-prefix">root@chatkaro:</span>
                    <span className="path">~</span>
                    <span className="prompt-char">#</span>
                    <span className="command"> sudo auth --login</span>
                </div>

                <form className="cli-form" onSubmit={handleLoginForm}>
                    <div className="input-row">
                        <span className="label">USERNAME:</span>
                        <input
                            type="text"
                            name="username"
                            placeholder="guest_user"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-row">
                        <span className="label">PASSWORD:</span>
                        <input
                            type="password"
                            name="password"
                            placeholder="********"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ERROR RENDERING SLOT */}
                    {error.isError && (
                        <div className="terminal-error">
                            <span className="error-prefix">[FATAL]:</span>
                            {error.errorMessage || "AUTHENTICATION_FAILURE_0x04"}
                        </div>
                    )}

                    <button type="submit">
                        {isPending ? "STATUS: EXECUTING..." : "EXECUTE_AUTH"}
                    </button>
                </form>

                <div className="cli-footer">
                    <span className="dimmed">No account found?</span>
                    <Link href="/signup" className="link"> ./create-node.sh</Link>
                </div>
            </div>
        </div>
    );
}