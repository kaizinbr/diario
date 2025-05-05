"use client";

import "dayjs/locale/pt-br";

import { DatePickerInput } from "@mantine/dates";
import "./calendar.module.css";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

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

    return (
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
            leftSection={<Calendar className="text-gray-500 h-4" />}
            classNames={{
                wrapper: `
                    w-40 shadow-lg !rounded-xl
                `,

                input: `
                    bg-white border !border-gray-300
                    !rounded-xl
                    w-40 
                `,
            }}
        />
    );
}
