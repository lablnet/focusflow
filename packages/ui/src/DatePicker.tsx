import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "./utils"

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className={cn("relative flex items-center w-full", className)}>
                <input
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0"
                    ref={ref}
                    {...props}
                />
                <CalendarIcon className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
        )
    }
)
DatePicker.displayName = "DatePicker"
