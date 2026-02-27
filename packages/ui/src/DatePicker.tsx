import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "./utils"

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                className={cn("relative w-full", className)}
                style={{ display: "flex", alignItems: "center" }}
            >
                <input
                    type="date"
                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0"
                    style={{ display: "flex" }}
                    ref={ref}
                    {...props}
                />
                <CalendarIcon
                    className="absolute h-4 w-4 text-muted-foreground"
                    style={{ left: "0.75rem", pointerEvents: "none" }}
                />
            </div>
        )
    }
)
DatePicker.displayName = "DatePicker"
