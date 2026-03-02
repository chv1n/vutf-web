import { ReactNode } from 'react'

interface MainLayoutProps {
    children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="glass-panel m-4 p-4 flex justify-between items-center sticky top-4 z-50">
                <div className="font-bold text-xl gradient-text">VUTF</div>
                <nav>
                    <ul className="flex gap-4 list-none">
                        <li><a href="#" className="text-text-muted hover:text-text transition-colors duration-300">Home</a></li>
                        <li><a href="#" className="text-text-muted hover:text-text transition-colors duration-300">About</a></li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow w-full max-w-[1200px] mx-auto py-8 px-4">
                {children}
            </main>

            <footer className="p-6 text-center text-text-muted text-sm">
                © {new Date().getFullYear()} VUTF Project. All rights reserved.
            </footer>
        </div>
    )
}
