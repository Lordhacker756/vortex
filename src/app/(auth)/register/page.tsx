"use client";
import React, { useEffect } from "react";
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
import { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { base64URLToBuffer, transformCredential } from "@/lib/utils";
import { ServerPublicKeyCredentialCreationOptions } from "@/lib/types";
import ServerStartingDialog from "@/components/custom/server-starting";

const RegisterPage = () => {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // if (localStorage.getItem("userId")) {
    //   router.push("/polls");
    // }
  }, [router]);

  let timer: NodeJS.Timeout; // Add timer variable
  const handlePasskeyRegistration = async () => {
    try {
      if (!username.trim()) {
        setError("Username is required");
        toast.error("Username is required");
        return;
      }
      setError("");

      timer = setTimeout(() => {
        // Store timer reference
        setShowDialog(true);
      }, 5000);

      const response = await axiosInstance.get("/api/auth/register", {
        params: {
          username: username.trim(),
        },
      });
      clearTimeout(timer); // Clear timer on success
      console.log("Resgister resposne:: ", response);

      let challengeObj: ServerPublicKeyCredentialCreationOptions =
        response.data;

      // Convert base64url encoded challenge to ArrayBuffer
      const challengeBuffer = base64URLToBuffer(
        challengeObj.publicKey.challenge
      );
      const userIdBuffer = base64URLToBuffer(challengeObj.publicKey.user.id);

      // Convert excludeCredentials ids to ArrayBuffer
      const excludeCredentials =
        challengeObj.publicKey.excludeCredentials?.map((credential) => ({
          ...credential,
          id: base64URLToBuffer(credential.id),
          transports: undefined, // Add if your server provides transports
        })) || [];

      // Prepare the options with proper ArrayBuffer conversions
      const options = {
        publicKey: {
          ...challengeObj.publicKey,
          challenge: challengeBuffer,
          user: {
            ...challengeObj.publicKey.user,
            id: userIdBuffer,
          },
          excludeCredentials,
        },
      };

      setIsRegistering(true);
      const originalCredential = await navigator.credentials.create(options);

      const transformedCredential = transformCredential(originalCredential);
      console.log(
        "Credential created:",
        originalCredential,
        transformedCredential
      );

      // Here you would typically send the credential back to your server
      const attestationResponse = await axiosInstance.post(
        `/api/auth/verify-register/${encodeURIComponent(username)}`,
        transformedCredential
      );

      console.log("Verification cookies:", document.cookie);

      console.log("Attestation response:", attestationResponse.data);
      toast.success("Successfully registered! Please log in.");

      router.push("/login");
    } catch (error) {
      console.error("Error registering passkey:", error);
      setError("Failed to register passkey: " + error.message);
      toast.error("Failed to register passkey");
      clearTimeout(timer); // Add timer cleanup here
    } finally {
      setShowDialog(false);
      setIsRegistering(false);
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

      {/* Right side - Register Form */}
      <div className="md:flex-1 flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-[400px]">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Register with a passkey for passwordless authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2 p-4">
                <Fingerprint className="h-12 w-12 text-gray-500" />
                <p className="text-sm text-center text-gray-500">
                  Use your device's biometric authentication to create a passkey
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isRegistering}
                />
                {error && (
                  <p className="text-sm text-red-500 break-words">{error}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                onClick={handlePasskeyRegistration}
                disabled={isRegistering}
              >
                {isRegistering
                  ? "Creating passkey..."
                  : "Register with Passkey"}
              </Button>
              <p className="text-sm text-center text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
