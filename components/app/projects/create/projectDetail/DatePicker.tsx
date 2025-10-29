"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 1, 5),
    to: new Date(2025, 2, 6),
  })

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-[175px] h-[35px] gap-2 rotate-0 opacity-100 
            pt-3 pr-4 pb-3 pl-4 rounded-lg border border-[#D0D5DD] 
            bg-[#FFFFFF] cursor-pointer"
          >
            <CalendarIcon className="w-[14.833px] h-[16.292px] rotate-0 opacity-100  text-[#344054]" />
            {date?.from ? (
              date.to ? (
                <div className="font-medium text-sm leading-5 tracking-normal text-[#344054]">
                  {format(date.from, "dd MMM")} – {format(date.to, "dd MMMM")}
                </div>
              ) : (
                format(date.from, "dd MMM")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 cursor-pointer" align="start">
          <Calendar

            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
