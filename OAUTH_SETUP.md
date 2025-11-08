# OAuth Setup Guide for AeThex

This guide will help you configure GitHub and Google OAuth login for your AeThex application.

## 🔧 Supabase OAuth Configuration

### 1. Access Your Supabase Dashboard

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project: `kmdeisowhtsalsekkzqd`
3. Navigate to **Authentication** > **Providers**

### 2. Configure Site URL

1. Go to **Authentication** > **Settings**
2. Set your Site URL to: `https://aethex.dev`
3. Add Redirect URLs:
   - `https://aethex.dev/dashboard`
   - `http://localhost:8080/dashboard` (for development)

## 🐙 GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name**: `AeThex Application`
   - **Homepage URL**: `https://aethex.dev`
   - **Authorization callback URL**: `https://kmdeisowhtsalsekkzqd.supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy the **Client ID** and **Client Secret**

### 2. Configure in Supabase

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **GitHub** and click to configure
3. Enable GitHub provider
4. Enter your **Client ID** and **Client Secret**
5. Click **Save**

## 🌐 Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** and **Google Identity API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configure consent screen if prompted
6. Choose **Web application**
7. Add Authorized redirect URIs:
   - `https://kmdeisowhtsalsekkzqd.supabase.co/auth/v1/callback`
8. Copy the **Client ID** and **Client Secret**

### 2. Configure in Supabase

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click to configure
3. Enable Google provider
4. Enter your **Client ID** and **Client Secret**
5. Click **Save**

## ✅ Testing OAuth Login

Once configured:

1. **GitHub Login**: Users can sign in with their GitHub account
2. **Google Login**: Users can sign in with their Google account
3. **Automatic Profile Creation**: New OAuth users get profiles automatically created
4. **Achievement Unlock**: New users automatically unlock the "AeThex Explorer" achievement

## 🔒 Security Notes

- Keep your Client Secrets secure and never commit them to version control
- Use environment variables for sensitive credentials in production
- Regularly rotate your OAuth credentials
- Monitor OAuth usage in your provider dashboards

## 🚀 Features Enabled

With OAuth configured, users can:

- **One-click login** with GitHub or Google
- **Automatic profile setup** with avatar and name from OAuth provider
- **Seamless integration** with existing AeThex community platform
- **Achievement progression** starting from first login

## 📞 Support

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

Your AeThex application will have fully functional social authentication once these providers are configured! 🎉
