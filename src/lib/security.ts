/**
 * Security utilities for the Trackify application
 */

// Validate required environment variables
export function validateEnvironment() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Sanitize error messages for production
export function sanitizeError(error: any): string {
  if (process.env.NODE_ENV === 'production') {
    return "An error occurred. Please try again.";
  }
  return error.message || "Internal server error";
}

// Validate and sanitize input strings
export function sanitizeString(input: string, maxLength: number = 100): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  const sanitized = input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
    
  return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
}

// Validate numeric input
export function validateNumber(value: any, min: number = 0, max: number = 999999): number | null {
  const num = parseFloat(value);
  if (isNaN(num) || num < min || num > max) {
    return null;
  }
  return num;
}

// Validate date input
export function validateDate(dateString: string): Date | null {
  const date = new Date(dateString + "T00:00:00");
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
}

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// CSRF token validation (basic implementation)
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // In a real implementation, you'd want to use a proper CSRF library
  // This is a simplified version for demonstration
  return token && sessionToken && token.length > 0;
}

// Input validation for subscription data
export function validateSubscriptionInput(data: any) {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.length > 100) {
    errors.push('Invalid name');
  }
  
  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0 || data.amount > 999999) {
    errors.push('Invalid amount');
  }
  
  if (!data.category || typeof data.category !== 'string' || data.category.length > 50) {
    errors.push('Invalid category');
  }
  
  const validBillingCycles = ['monthly', 'yearly', 'twoYear', 'threeYear'] as const;
  if (!data.billingCycle || !validBillingCycles.includes(data.billingCycle as any)) {
    errors.push('Invalid billing cycle');
  }
  
  const validFrequencies = ['oneTime', 'recurring'] as const;
  if (!data.frequency || !validFrequencies.includes(data.frequency as any)) {
    errors.push('Invalid frequency');
  }
  
  if (!data.nextDueDate || validateDate(data.nextDueDate) === null) {
    errors.push('Invalid due date');
  }
  
  return errors;
} 