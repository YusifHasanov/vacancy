import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

export default function SearchComponent() {
    return (
        <div className="relative w-[55%] mt-10 mx-auto">
            <Input
                type="text"
                placeholder="Menecer, Satış mütəxəssisi, Proqramçı ..."
                className="w-full pr-[120px] pl-7 h-14 text-xl"
            />
            <div className="absolute right-0 top-0 flex h-full items-center space-x-1 pr-3">
                <Button variant="ghost" size="icon" aria-label="Filter">
                    <Filter className="h-4 w-4" />
                </Button>
                <Button size="sm" className="px-3">
                    <Search className="h-4 w-4 mr-2" />
                    Axtar
                </Button>
            </div>
        </div>
    )
}