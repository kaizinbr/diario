"use client";

import "dayjs/locale/pt-br";

import { DatePickerInput } from "@mantine/dates";
import "./calendar.module.css";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarDatePicker({
    value,
    setValue,
}: {
    value: Date | null;
    setValue: (date: Date | null) => void;
}) {
    const formattedValue = value
        ? dayjs(value).format("YYYY-MM-DD HH:mm:ss")
        : null;

    const handlePreviousDay = () => {
        if (value) {
            const previousDay = new Date(value);
            previousDay.setDate(previousDay.getDate() - 1);
            setValue(previousDay);
        }
    };

    const handleNextDay = () => {
        if (value) {
            const nextDay = new Date(value);
            nextDay.setDate(nextDay.getDate() + 1);
            setValue(nextDay);
        }
    };

    const isToday = value
        ? dayjs(value).isSame(dayjs(), "day")
        : false;

    return (
        <div className="flex gap-1">
            <button
                onClick={handlePreviousDay}
                className="text-center flex items-center justify-center size-9 cursor-pointer bg-white rounded-xl shadow-lg border !border-neutral-300 hover:bg-gray-100 !transition-all !duration-200 !ease-in-out"
            >
                <ChevronLeft className="text-neutral-600 h-4" />
            </button>
            <DatePickerInput
                locale="pt-br"
                placeholder="Escolha uma data"
                valueFormat="DD/MM/YYYY"
                value={formattedValue}
                onChange={(val) => {
                    if (val) {
                        const adjustedDate = new Date(val);
                        adjustedDate.setMinutes(
                            adjustedDate.getMinutes() +
                                adjustedDate.getTimezoneOffset()
                        );
                        setValue(adjustedDate);
                    } else {
                        setValue(null);
                    }
                }}
                maxDate={new Date()}
                leftSection={<Calendar className="text-neutral-500 h-4" />}
                classNames={{
                    wrapper: `
                        w-40 shadow-lg !rounded-xl
                    `,
                    input: `
                        bg-white border !border-neutral-300
                        !rounded-xl
                        w-40 
                    `,
                }}
            />
            <button
                onClick={handleNextDay}
                disabled={isToday}
                className={`text-center flex items-center justify-center size-9 cursor-pointer
                     rounded-xl shadow-lg border !border-neutral-300 hover:bg-gray-100 
                    !transition-all !duration-200 !ease-in-out ${
                    isToday
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100"
                }`}
            >
                <ChevronRight className="text-neutral-600 h-4" />
            </button>
        </div>
    );
}