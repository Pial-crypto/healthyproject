"use client";

import { CookieUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home() {
  const router = useRouter();
  const [user,setUser]=useState<CookieUser>()
  const [loading,setIsLoadingUser]=useState(true);
useEffect(() => {
  async function checkUser() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return router.push("/auth/login");

      const resData = await res.json();
      if (!resData.authenticated) return router.push("/auth/login");

      setUser(resData.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      router.push("/auth/login");
    } finally {
      setIsLoadingUser(false);
    }
  }
  checkUser();
}, [router]);

// Redirect after user is fetched
useEffect(() => {
  if (!user) return;

  if (user.role === "admin") {
    router.push("/admin");
  } else if (user.role === "employee") {
    router.push("/employee");
  } else if (user.role === "client") {
    router.push("/client");
  } else {
    router.push("/auth/login");
  }
}, [user, router]);



  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
