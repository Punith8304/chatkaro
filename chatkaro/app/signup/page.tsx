"use client"

import Link from 'next/link';
import './signup.css';
import { useState } from 'react';

export default function Signup() {
  const [error, setError] = useState({
    isError: true,
    errorMessage: "This is error"
  })
  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-header">
          <h1>Sign Up</h1>
          <p>Create your account</p>
        </div>

        <form className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
            />
          </div>
          <div>
            {error.isError ? <p className='signup-error-message'>{error.errorMessage}</p> : null}
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </div>
          
        </form>

        <Link href="/login" className="login-link">Already have an account? Sign in</Link>
      </div>
    </div>
  );
}