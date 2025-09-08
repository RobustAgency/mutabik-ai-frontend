import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { ChevronLeft } from 'lucide-react'
import { DrawerTrigger } from '../ui/drawer'
import ProfileInfo from './ProfileInfo'
import SearchBar from './SearchBar'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
    const headerGridClass = cn(
        "grid w-full min-h-14 sticky top-0 z-30 border-b bg-background/80 backdrop-blur py-1 bg-[#FFFFFF]",
        // Mobile: content + profile columns
        "grid-cols-[minmax(0,1fr)_auto]",
        // Desktop: first column reserved for sidebar width
        "md:grid-cols-[200px_minmax(0,1fr)]"
    )

    return (
        <header className={headerGridClass}>
            <div className="h-full w-full flex items-center justify-between px-4">
                <div className="w-full flex items-center justify-start md:justify-between gap-0 md:gap-2">
                    <div aria-details="logo">
                        <Link href="/" className='hidden md:block'>
                            <Image src="/logo.png" alt="logo" width={120} height={56} />
                        </Link>
                    </div>
                    <DrawerTrigger className="md:hidden" asChild>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            aria-label="Open sidebar"
                        >
                            <ChevronLeft className="size-4 rotate-180" />
                        </Button>
                    </DrawerTrigger>
                </div>
            </div>
              <div className='flex items-center justify-end gap-0.5'>
                <SearchBar />
                <ProfileInfo />
              </div>

        </header>
    )
}

export default Header