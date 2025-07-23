import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// Initialize the Secret Manager client
const client = new SecretManagerServiceClient();

// Cache for secrets to avoid repeated API calls
const secretCache = new Map<string, { value: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Project ID - you'll need to set this in your environment
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'trackify-464805';

/**
 * Get a secret from Google Secret Manager or environment variables
 * @param secretName - The name of the secret (e.g., 'google-client-id')
 * @param version - The version of the secret (default: 'latest')
 * @returns The secret value
 */
export async function getSecret(secretName: string, version: string = 'latest'): Promise<string> {
  // In development, use environment variables directly
  if (process.env.NODE_ENV === 'development') {
    const envValue = process.env[secretName];
    if (envValue) {
      return envValue;
    }
    throw new Error(`Environment variable ${secretName} not found`);
  }

  try {
    // Check cache first
    const cacheKey = `${secretName}-${version}`;
    const cached = secretCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.value;
    }

    // Construct the secret name
    const secretPath = `projects/${PROJECT_ID}/secrets/${secretName}/versions/${version}`;

    // Access the secret
    const [secretVersion] = await client.accessSecretVersion({ name: secretPath });
    
    if (!secretVersion.payload?.data) {
      throw new Error(`Secret ${secretName} not found or empty`);
    }

    // Convert the secret data to string
    const secretValue = secretVersion.payload.data.toString();

    // Cache the result
    secretCache.set(cacheKey, {
      value: secretValue,
      timestamp: Date.now()
    });

    return secretValue;
  } catch (error) {
    console.error(`Error accessing secret ${secretName}:`, error);
    throw new Error(`Failed to access secret ${secretName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get multiple secrets at once
 * @param secretNames - Array of secret names
 * @returns Object with secret names as keys and values as values
 */
export async function getSecrets(secretNames: string[]): Promise<Record<string, string>> {
  const secrets: Record<string, string> = {};
  
  await Promise.all(
    secretNames.map(async (secretName) => {
      try {
        secrets[secretName] = await getSecret(secretName);
      } catch (error) {
        console.error(`Failed to get secret ${secretName}:`, error);
        throw error;
      }
    })
  );
  
  return secrets;
}

/**
 * Clear the secret cache (useful for testing or when secrets are updated)
 */
export function clearSecretCache(): void {
  secretCache.clear();
}

/**
 * Get all required secrets for the application
 */
export async function getAppSecrets(): Promise<{
  googleClientId: string;
  googleClientSecret: string;
  databaseUrl: string;
  nextAuthSecret: string;
  nextAuthUrl?: string;
}> {
  const secretNames = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'DATABASE_URL',
    'NEXTAUTH_SECRET'
  ];

  const secrets = await getSecrets(secretNames);
  
  return {
    googleClientId: secrets['GOOGLE_CLIENT_ID'],
    googleClientSecret: secrets['GOOGLE_CLIENT_SECRET'],
    databaseUrl: secrets['DATABASE_URL'],
    nextAuthSecret: secrets['NEXTAUTH_SECRET'],
    nextAuthUrl: process.env.NEXTAUTH_URL // Use environment variable for now
  };
}

/**
 * Validate that all required secrets are available
 */
export async function validateSecrets(): Promise<void> {
  const requiredSecrets = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'DATABASE_URL',
    'NEXTAUTH_SECRET'
  ];

  const missingSecrets: string[] = [];

  for (const secretName of requiredSecrets) {
    try {
      await getSecret(secretName);
    } catch (error) {
      missingSecrets.push(secretName);
    }
  }

  if (missingSecrets.length > 0) {
    throw new Error(`Missing required secrets: ${missingSecrets.join(', ')}`);
  }
} 