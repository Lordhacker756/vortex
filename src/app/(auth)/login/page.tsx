"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { base64URLToBuffer, transformLoginVerifyCredential } from "@/lib/utils";
import ServerStartingDialog from "@/components/custom/server-starting";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  let timer: NodeJS.Timeout;

  const handlePasskeyLogin = async () => {
    try {
      if (!username.trim()) {
        setError("Username is required");
        toast.error("Username is required");
        return;
      }
      setError("");
      setIsLoading(true);

      timer = setTimeout(() => {
        setShowDialog(true);
      }, 5000);

      // Get the authentication options from the server
      const response = await axiosInstance.get("/api/auth/login", {
        params: {
          username: username.trim(),
        },
      });
      clearTimeout(timer);
      setShowDialog(false);
      let challengeObj = response.data;

      // Convert base64url encoded challenge to ArrayBuffer
      const challengeBuffer = base64URLToBuffer(
        challengeObj.publicKey.challenge
      );

      // Convert allowCredentials ids to ArrayBuffer if present
      const allowCredentials =
        challengeObj.publicKey.allowCredentials?.map((credential) => ({
          ...credential,
          id: base64URLToBuffer(credential.id),
          transports: undefined,
        })) || [];

      // Prepare the options with proper ArrayBuffer conversions
      const options = {
        publicKey: {
          ...challengeObj.publicKey,
          challenge: challengeBuffer,
          allowCredentials,
        },
      };

      const credential = await navigator.credentials.get(options);
      const transformedCredential = transformLoginVerifyCredential(credential);

      // Send the credential to the server for verification
      const verificationResponse = await axiosInstance.post(
        `/api/auth/verify-login/${encodeURIComponent(username)}`,
        transformedCredential
      );

      const { token, userId } = verificationResponse.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      toast.success("Successfully logged in!");
      router.push("/polls");
    } catch (error) {
      setShowDialog(false);
      console.error("Error logging in with passkey:" + error.message);
      setError("Failed to sign in with passkey - " + error.message);
      clearTimeout(timer); // Add timer cleanup here
    } finally {
      setShowDialog(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <ServerStartingDialog open={showDialog} setOpen={setShowDialog} />

      {/* Left side - About Vortex */}
      <div className="md:flex-1 flex flex-col justify-center p-6 md:p-12 md:pb-0 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6">
          Vortex ⚡️
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-6 md:mb-4">
          The Real-Time Voting Platform That Matters
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="md:flex-1 flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-[400px]">
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
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
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
