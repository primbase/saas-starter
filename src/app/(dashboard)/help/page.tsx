'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    BookOpen,
    Code,
    Palette,
    Database,
    Shield,
    Rocket,
    ChevronRight,
    ExternalLink,
    Copy,
    Check,
    FileCode,
    Folder,
    Terminal,
    Zap,
    Layout,
    Users,
    Settings,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const quickStartSteps = [
    {
        step: 1,
        title: 'Clone & Install',
        description: 'Clone the repository and install dependencies',
        code: 'git clone <repo-url>\ncd app-template\nnpm install',
    },
    {
        step: 2,
        title: 'Configure Supabase',
        description: 'Add your Supabase credentials to .env.local',
        code: 'NEXT_PUBLIC_SUPABASE_URL=your-url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-key',
    },
    {
        step: 3,
        title: 'Run Migrations',
        description: 'Execute the SQL in README.md to create the profiles table',
        code: '-- Run in Supabase SQL Editor\nCREATE TABLE profiles (...)',
    },
    {
        step: 4,
        title: 'Start Development',
        description: 'Run the development server',
        code: 'npm run dev',
    },
]

const features = [
    {
        icon: Shield,
        title: 'Authentication',
        description: 'Complete auth flow with Supabase including login, signup, password reset, and email verification.',
        path: '/login',
    },
    {
        icon: Layout,
        title: 'Dashboard Layout',
        description: 'Responsive sidebar navigation with collapsible mode and mobile-friendly drawer.',
        path: '/dashboard',
    },
    {
        icon: Users,
        title: 'User Profiles',
        description: 'Profile management with avatar upload, bio, and customizable user preferences.',
        path: '/settings/profile',
    },
    {
        icon: Palette,
        title: 'Theme System',
        description: 'Dark/light mode with system preference detection and persistent user choice.',
        path: '/settings/preferences',
    },
    {
        icon: Database,
        title: 'Database Ready',
        description: 'Supabase integration with TypeScript types, RLS policies, and helper functions.',
        path: '/documents',
    },
    {
        icon: Zap,
        title: 'Modern Stack',
        description: 'Built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn/ui components.',
        path: '/analytics',
    },
]

const projectStructure = [
    { name: 'src/', type: 'folder', indent: 0 },
    { name: 'app/', type: 'folder', indent: 1 },
    { name: '(auth)/', type: 'folder', indent: 2, desc: 'Auth pages (login, signup, etc.)' },
    { name: '(dashboard)/', type: 'folder', indent: 2, desc: 'Dashboard pages with layout' },
    { name: 'layout.tsx', type: 'file', indent: 2, desc: 'Root layout with providers' },
    { name: 'page.tsx', type: 'file', indent: 2, desc: 'Landing page' },
    { name: 'components/', type: 'folder', indent: 1 },
    { name: 'auth/', type: 'folder', indent: 2, desc: 'Auth form components' },
    { name: 'dashboard/', type: 'folder', indent: 2, desc: 'Sidebar, TopNav, Layout' },
    { name: 'ui/', type: 'folder', indent: 2, desc: 'shadcn/ui components' },
    { name: 'shared/', type: 'folder', indent: 2, desc: 'Reusable components' },
    { name: 'hooks/', type: 'folder', indent: 1, desc: 'Custom React hooks' },
    { name: 'lib/', type: 'folder', indent: 1, desc: 'Utilities and Supabase client' },
    { name: 'types/', type: 'folder', indent: 1, desc: 'TypeScript types' },
]

const faqs = [
    {
        q: 'How do I disable demo mode?',
        a: 'Open src/hooks/useAuth.tsx and set DEMO_MODE = false. Then configure your Supabase credentials in .env.local.',
    },
    {
        q: 'How do I add a new page?',
        a: 'Create a new folder in src/app/(dashboard)/your-page/ with a page.tsx file. Add a link in the Sidebar component.',
    },
    {
        q: 'How do I customize the theme colors?',
        a: 'Edit src/app/globals.css and modify the CSS variables under :root and .dark selectors.',
    },
    {
        q: 'How do I add new shadcn/ui components?',
        a: 'Run npx shadcn@latest add [component-name] to install new components.',
    },
    {
        q: 'Where do I add API routes?',
        a: 'Create files in src/app/api/your-route/route.ts following Next.js App Router conventions.',
    },
]

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    const copy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
    )
}

export default function HelpPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Help & Documentation</h1>
                <p className="text-muted-foreground">
                    Everything you need to know to build your project with this template.
                </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link href="#getting-started">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <Rocket className="h-8 w-8 text-primary mb-2" />
                            <span className="text-sm font-medium">Getting Started</span>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="#features">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <Zap className="h-8 w-8 text-amber-500 mb-2" />
                            <span className="text-sm font-medium">Features</span>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="#structure">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <Folder className="h-8 w-8 text-blue-500 mb-2" />
                            <span className="text-sm font-medium">Project Structure</span>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="#faq">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <BookOpen className="h-8 w-8 text-emerald-500 mb-2" />
                            <span className="text-sm font-medium">FAQ</span>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Getting Started */}
            <section id="getting-started">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Rocket className="h-5 w-5 text-primary" />
                            Getting Started
                        </CardTitle>
                        <CardDescription>
                            Follow these steps to set up your project
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {quickStartSteps.map((item) => (
                                <div key={item.step} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                        {item.step}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {item.description}
                                        </p>
                                        <div className="relative bg-muted rounded-lg p-3 font-mono text-sm">
                                            <pre className="overflow-x-auto">{item.code}</pre>
                                            <div className="absolute top-2 right-2">
                                                <CopyButton text={item.code} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Features */}
            <section id="features">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-500" />
                            Features
                        </CardTitle>
                        <CardDescription>
                            What&apos;s included in this template
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {features.map((feature) => (
                                <Link key={feature.title} href={feature.path}>
                                    <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                                        <CardContent className="p-4">
                                            <feature.icon className="h-8 w-8 text-primary mb-3" />
                                            <h4 className="font-semibold mb-1">{feature.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Project Structure */}
            <section id="structure">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Folder className="h-5 w-5 text-blue-500" />
                            Project Structure
                        </CardTitle>
                        <CardDescription>
                            Overview of the codebase organization
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                            {projectStructure.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 py-1"
                                    style={{ paddingLeft: `${item.indent * 1.5}rem` }}
                                >
                                    {item.type === 'folder' ? (
                                        <Folder className="h-4 w-4 text-amber-500" />
                                    ) : (
                                        <FileCode className="h-4 w-4 text-blue-500" />
                                    )}
                                    <span>{item.name}</span>
                                    {item.desc && (
                                        <span className="text-muted-foreground text-xs ml-2">
                                            — {item.desc}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Tech Stack */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-purple-500" />
                        Tech Stack
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-sm py-1 px-3">Next.js 14+</Badge>
                        <Badge variant="secondary" className="text-sm py-1 px-3">TypeScript</Badge>
                        <Badge variant="secondary" className="text-sm py-1 px-3">Tailwind CSS</Badge>
                        <Badge variant="secondary" className="text-sm py-1 px-3">shadcn/ui</Badge>
                        <Badge variant="secondary" className="text-sm py-1 px-3">Supabase</Badge>
                        <Badge variant="secondary" className="text-sm py-1 px-3">React Hook Form</Badge>
                        <Badge variant="secondary" className="text-sm py-1 px-3">Zod</Badge>
                        <Badge variant="secondary" className="text-sm py-1 px-3">Lucide Icons</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* FAQ */}
            <section id="faq">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-emerald-500" />
                            Frequently Asked Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                                    <h4 className="font-semibold mb-2">{faq.q}</h4>
                                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Need More Help */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
                    <p className="text-muted-foreground mb-4">
                        Check out the README.md for detailed setup instructions and Supabase SQL migrations.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Button variant="outline" asChild>
                            <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
                                Next.js Docs
                                <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
                                Supabase Docs
                                <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
                                shadcn/ui
                                <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
