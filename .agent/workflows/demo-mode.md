---
description: Enable or disable demo mode to bypass authentication for UI preview
---

# Demo Mode Workflow

This project includes a **demo mode** that bypasses authentication for previewing the dashboard UI without setting up Supabase.

## Current Status
**Demo Mode: ENABLED** ✅

## How It Works
When demo mode is enabled:
- Dashboard pages are accessible without login
- Mock user data is displayed (name: "Demo User", email: "demo@example.com")
- All UI components work normally
- Auth pages (login, signup) still function for viewing

## Toggle Demo Mode

### To DISABLE demo mode (require real auth):
1. Open `src/hooks/useAuth.tsx`
2. Find the line: `const DEMO_MODE = true`
3. Change to: `const DEMO_MODE = false`
4. Configure real Supabase credentials in `.env.local`

### To ENABLE demo mode:
1. Open `src/hooks/useAuth.tsx`
2. Find the line: `const DEMO_MODE = false`
3. Change to: `const DEMO_MODE = true`

## Routes Available in Demo Mode
- `/` - Landing page
- `/login` - Login form (viewable, submissions won't work)
- `/signup` - Signup form (viewable, submissions won't work)
- `/dashboard` - Main dashboard with demo data
- `/settings/profile` - Profile settings
- `/settings/account` - Account settings
- `/settings/preferences` - Theme and notifications
- `/settings/security` - Security settings

## Note for AI Agents
// turbo-all
When working on this project:
- Check if `DEMO_MODE` is enabled before testing auth flows
- Real auth testing requires Supabase configuration
- See README.md for Supabase setup instructions
