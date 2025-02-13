"use client";
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
import { useState } from "react";
import Link from "next/link";

const RegisterPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handlePasskeyRegistration = async () => {
    setIsRegistering(true);
    try {
      const options = {
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "Vortex",
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: "user@example.com",
            displayName: "New User",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "preferred",
          },
        },
      };

      const credential = await navigator.credentials.create(options);
      console.log("Credential created:", credential);
    } catch (error) {
      console.error("Error registering passkey:", error);
    } finally {
      setIsRegistering(false);
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

      {/* Right side - Register Form */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[400px]">
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
