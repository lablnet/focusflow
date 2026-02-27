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
                    "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors",
                    "hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    open && "ring-2 ring-ring ring-offset-1"
                )}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
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
                <ChevronDown
                    className="h-4 w-4 text-muted-foreground"
                    style={{
                        marginLeft: "0.5rem",
                        flexShrink: 0,
                        transition: "transform 200ms",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                />
            </button>

            {open && (
                <div
                    className="absolute z-50 w-full overflow-hidden rounded-xl border border-border/60 bg-popover text-popover-foreground"
                    style={{ marginTop: "6px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
                >
                    <div
                        className="border-b border-border/60 px-3 py-2"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <Search className="h-4 w-4 text-muted-foreground/60" style={{ marginRight: "0.5rem", flexShrink: 0 }} />
                        <input
                            ref={inputRef}
                            className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground/60"
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div style={{ maxHeight: "13rem", overflowY: "auto", padding: "4px" }}>
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground/60">No results found.</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={cn(
                                        "rounded-lg px-2.5 py-2 text-sm cursor-pointer transition-colors",
                                        "hover:bg-accent/60",
                                        value === opt.value && "bg-accent text-accent-foreground font-medium"
                                    )}
                                    style={{ display: "flex", alignItems: "center", userSelect: "none" }}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                        setSearchQuery("");
                                    }}
                                >
                                    {value === opt.value ? (
                                        <Check className="h-4 w-4 text-primary" style={{ marginRight: "0.5rem", flexShrink: 0 }} />
                                    ) : (
                                        <span style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", flexShrink: 0, display: "inline-block" }} />
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
