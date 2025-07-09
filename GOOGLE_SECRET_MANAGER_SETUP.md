# Google Secret Manager Setup Guide

This guide will help you set up Google Secret Manager to securely store your application secrets for the Trackify application.

## Prerequisites

1. **Google Cloud Project**: You need a Google Cloud Project
2. **Google Cloud CLI**: Install and configure the Google Cloud CLI
3. **Billing**: Enable billing for your Google Cloud Project
4. **Permissions**: You need the "Secret Manager Admin" role

## Step 1: Enable Secret Manager API

```bash
# Enable the Secret Manager API
gcloud services enable secretmanager.googleapis.com
```

## Step 2: Create Secrets

Create the following secrets in Google Secret Manager:

### 1. Google Client ID
```bash
echo -n "your-google-client-id-here" | gcloud secrets create google-client-id --data-file=-
```

### 2. Google Client Secret
```bash
echo -n "your-google-client-secret-here" | gcloud secrets create google-client-secret --data-file=-
```

### 3. Database URL
```bash
echo -n "postgresql://username:password@host:port/database" | gcloud secrets create database-url --data-file=-
```

### 4. NextAuth Secret
```bash
# Generate a secure random string
openssl rand -base64 32 | gcloud secrets create nextauth-secret --data-file=-
```

### 5. NextAuth URL
```bash
echo -n "https://your-domain.com" | gcloud secrets create nextauth-url --data-file=-
```

## Step 3: Set Up Authentication

### Option A: Service Account (Recommended for Production)

1. **Create a Service Account**:
```bash
gcloud iam service-accounts create trackify-secrets \
    --display-name="Trackify Secrets Service Account"
```

2. **Grant Secret Manager Access**:
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:trackify-secrets@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

3. **Create and Download Key**:
```bash
gcloud iam service-accounts keys create key.json \
    --iam-account=trackify-secrets@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

4. **Set Environment Variable**:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json"
```

### Option B: Application Default Credentials (Development)

```bash
gcloud auth application-default login
```

## Step 4: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Google Cloud Project ID
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Authentication (choose one)
GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json  # For service account
# OR use gcloud auth application-default login for development
```

## Step 5: Update Your Application

The application has been updated to use Google Secret Manager. The following files have been modified:

- `src/lib/secrets.ts` - Secret Manager utility functions
- `src/lib/database.ts` - Database connection with secrets
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth with secrets
- `src/app/api/subscriptions/route.ts` - API routes with secrets
- `src/app/api/subscriptions/[id]/route.ts` - API routes with secrets

## Step 6: Test the Setup

1. **Start your development server**:
```bash
npm run dev
```

2. **Check the logs** for any secret loading errors

3. **Test authentication** by trying to sign in

## Step 7: Production Deployment

### For Vercel:

1. **Set Environment Variables** in Vercel dashboard:
   - `GOOGLE_CLOUD_PROJECT_ID`
   - `GOOGLE_APPLICATION_CREDENTIALS` (as a JSON string)

2. **Or use Vercel's Google Cloud integration**:
   - Connect your Google Cloud account in Vercel
   - Vercel will automatically handle authentication

### For Other Platforms:

1. **Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable** to the service account key JSON
2. **Set the `GOOGLE_CLOUD_PROJECT_ID` environment variable**

## Step 8: Security Best Practices

### 1. Rotate Secrets Regularly
```bash
# Create a new version of a secret
echo -n "new-secret-value" | gcloud secrets versions add google-client-secret --data-file=-
```

### 2. Monitor Access
```bash
# View secret access logs
gcloud logging read "resource.type=secretmanager.googleapis.com/Secret"
```

### 3. Set Up Alerts
Create Cloud Monitoring alerts for:
- Failed secret access attempts
- Unusual access patterns

### 4. Use IAM Conditions
```bash
# Restrict access to specific IP ranges
gcloud secrets add-iam-policy-binding google-client-id \
    --member="serviceAccount:trackify-secrets@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --condition="expression=request.ip.matches('YOUR_IP_RANGE')"
```

## Troubleshooting

### Common Issues:

1. **"Permission denied" errors**:
   - Check that your service account has the correct roles
   - Verify the project ID is correct

2. **"Secret not found" errors**:
   - Verify the secret name matches exactly
   - Check that the secret exists in the correct project

3. **Authentication errors**:
   - Ensure `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
   - Verify the service account key is valid

### Debug Commands:

```bash
# List all secrets
gcloud secrets list

# View secret metadata
gcloud secrets describe google-client-id

# Access a secret manually
gcloud secrets versions access latest --secret="google-client-id"

# Check service account permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID \
    --flatten="bindings[].members" \
    --format="table(bindings.role)" \
    --filter="bindings.members:trackify-secrets@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

## Cost Considerations

- **Secret Manager pricing**: $0.06 per 10,000 API calls
- **Storage**: $0.03 per secret version per month
- **For typical usage**: ~$1-5/month for a small application

## Migration from Environment Variables

If you're migrating from environment variables:

1. **Create secrets** using the commands above
2. **Update your deployment** to use the new authentication
3. **Test thoroughly** in a staging environment
4. **Remove environment variables** from your deployment platform
5. **Update documentation** for your team

## Support

For issues with Google Secret Manager:
- [Google Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Google Cloud Support](https://cloud.google.com/support)

For issues with the Trackify application integration:
- Check the application logs
- Verify the secret names match exactly
- Ensure all required secrets are created 