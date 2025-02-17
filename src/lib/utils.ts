import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OriginalCredential, RegisterCredential, RegisterPublicKeyCredential } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const base64URLToBuffer = (base64URL: string): ArrayBuffer => {
  const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64.padEnd(base64.length + padLen, '=');
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
};

export function transformCredential(credential: PublicKeyCredential): RegisterCredential {
  const response = credential.response as AuthenticatorAttestationResponse;

  return {
    id: credential.id,
    rawId: bufferToBase64URL(credential.rawId),
    response: {
      attestationObject: bufferToBase64URL(response.attestationObject),
      clientDataJSON: bufferToBase64URL(response.clientDataJSON),
    },
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment
  };
}

// Helper function to convert ArrayBuffer to base64url string
export function bufferToBase64URL(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}