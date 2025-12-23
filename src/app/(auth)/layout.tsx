import { Sparkles } from 'lucide-react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 via-primary to-primary/80 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-grid-white/10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold">AppTemplate</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">
                        Start building your next great idea
                    </h1>
                    <p className="text-lg text-white/80 mb-8">
                        A comprehensive web application template with authentication,
                        dashboard, and everything you need to get started quickly.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Secure authentication built-in</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Modern dashboard with settings</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Dark mode & responsive design</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-background to-muted/30">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    )
}
