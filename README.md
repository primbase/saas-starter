# AppTemplate - Web Application Starter

A comprehensive, production-ready web application template built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Complete Authentication** - Login, signup, password reset, email verification
- 📊 **Dashboard Layout** - Collapsible sidebar, responsive top navigation
- ⚙️ **Settings Pages** - Profile, account, preferences, security management
- 🌓 **Dark Mode** - System preference detection with manual toggle
- 📱 **Responsive Design** - Mobile-first approach with tablet/desktop optimization
- 🎨 **Modern UI** - shadcn/ui components with customizable violet theme

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
- **State**: React Context + Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd app-template
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AppTemplate
```

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the following SQL in the Supabase SQL Editor to create the profiles table:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  sidebar_collapsed BOOLEAN DEFAULT false,
  email_notifications JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

3. Configure authentication settings in Supabase Dashboard:
   - Enable Email authentication
   - Set Email confirmation to required
   - Add redirect URL: `http://localhost:3000/auth/callback`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, signup, etc.)
│   ├── (dashboard)/      # Dashboard pages with layout
│   └── page.tsx          # Landing page
├── components/
│   ├── auth/             # Auth form components
│   ├── dashboard/        # Dashboard layout components
│   ├── settings/         # Settings form components
│   ├── shared/           # Shared components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
└── types/                # TypeScript type definitions
```

## Customization

### Theme Colors

Edit `src/app/globals.css` to customize the violet color scheme. The colors use oklch format for consistent appearance across light and dark modes.

### Adding Pages

1. Create a new page in `src/app/(dashboard)/your-page/page.tsx`
2. Add navigation link in `src/components/dashboard/Sidebar.tsx`

## License

MIT
