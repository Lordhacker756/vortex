"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    try {
      const options = {
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          allowCredentials: [], // This should be populated with the user's credentials
          userVerification: "preferred",
        },
      };

      const credential = await navigator.credentials.get({
        publicKey: options.publicKey,
      });
      console.log("Credential verified:", credential);
    } catch (error) {
      console.error("Error logging in with passkey:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - About Vortex */}
      <div className="flex-1 flex flex-col justify-center px-12">
        <h1 className="text-6xl font-bold text-white mb-6">Vortex ⚡️</h1>
        <p className="text-xl text-gray-400 mb-4">
          The Real-Time Voting Platform That Matters
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[400px]">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in with your passkey</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2 p-4">
                <Fingerprint className="h-12 w-12 text-gray-500" />
                <p className="text-sm text-center text-gray-500">
                  Use your device's biometric authentication to sign in
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                onClick={handlePasskeyLogin}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in with Passkey"}
              </Button>
              <p className="text-sm text-center text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-500 hover:underline"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
