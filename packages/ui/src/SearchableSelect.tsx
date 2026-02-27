import * as React from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "./utils"

export interface Option {
    label: string;
    value: string;
}

export interface SearchableSelectProps {
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchableSelect({ options, value, onChange, placeholder = "Select…", className }: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            <button
                type="button"
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors",
                    "hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    open && "ring-2 ring-ring ring-offset-1"
                )}
                onClick={() => {
                    setOpen(!open);
                    if (!open) {
                        setTimeout(() => inputRef.current?.focus(), 0);
                    }
                }}
            >
                <span className={cn("truncate text-left", !selectedOption && "text-muted-foreground")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground ml-2 shrink-0 transition-transform duration-200", open && "rotate-180")} />
            </button>

            {open && (
                <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-lg shadow-black/[0.08] animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="flex items-center border-b border-border/60 px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground/60" />
                        <input
                            ref={inputRef}
                            className="flex h-full w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground/60"
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="max-h-52 overflow-y-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground/60">No results found.</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={cn(
                                        "relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-2 text-sm transition-colors",
                                        "hover:bg-accent/60",
                                        value === opt.value && "bg-accent text-accent-foreground font-medium"
                                    )}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                        setSearchQuery("");
                                    }}
                                >
                                    {value === opt.value ? (
                                        <Check className="mr-2 h-4 w-4 shrink-0 text-primary" />
                                    ) : (
                                        <span className="mr-2 h-4 w-4 shrink-0 inline-block" />
                                    )}
                                    {opt.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
