"use client"

import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store"
import { Suspense, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
// import ChatUI from './ChatUI';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    
    return <>{children}</>
}