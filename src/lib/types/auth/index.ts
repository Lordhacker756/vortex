export interface PublicKeyCredentialUserEntity {
    id: string;
    name: string;
    displayName: string;
}

export interface PublicKeyCredentialRpEntity {
    name: string;
    id: string;
}

export interface AuthenticatorSelectionCriteria {
    residentKey: 'discouraged' | 'preferred' | 'required';
    requireResidentKey: boolean;
    userVerification: 'required' | 'preferred' | 'discouraged';
}

export interface ServerPublicKeyCredentialCreationOptions {
    publicKey: {
        rp: PublicKeyCredentialRpEntity;
        user: PublicKeyCredentialUserEntity;
        challenge: string;
        pubKeyCredParams: PublicKeyCredentialParameters[];
        timeout: number;
        authenticatorSelection: AuthenticatorSelectionCriteria;
        excludeCredentials?: PublicKeyCredentialDescriptor[];
        attestation: 'none' | 'direct' | 'indirect' | 'enterprise';
        extensions?: {
            credentialProtectionPolicy?: string;
            enforceCredentialProtectionPolicy?: boolean;
            uvm?: boolean;
            credProps?: boolean;
        };
    };
}

// Original credential type from WebAuthn API
export interface OriginalCredential {
    authenticatorAttachment: string;
    clientExtensionResults: {
        credProps: {
            rk: boolean;
        };
    };
    id: string;
    rawId: string;
    response: {
        attestationObject: string;
        authenticatorData: string;
        clientDataJSON: string;
        publicKey: string;
        publicKeyAlgorithm: number;
        transports: string[];
    };
    type: string;
}

// Transformed credential type expected by the Rust backend
export interface RegisterPublicKeyCredential {
    id: string;
    raw_id: string;
    response: {
        attestation_object: string;
        client_data_json: string;
    };
    type: string;
    authenticator_attachment?: string;
}

export interface AttestationResponse {
    attestationObject: string; // base64url encoded
    clientDataJSON: string;    // base64url encoded
}

export interface RegisterCredential {
    id: string;
    rawId: string;           // base64url encoded
    response: AttestationResponse;
    type: 'public-key';
    authenticatorAttachment?: AuthenticatorAttachment;
}