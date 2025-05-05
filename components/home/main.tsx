"use client";


import { useState } from "react";

import { CalendarDatePicker } from "@/components/home/calendar";
import Feed from "@/components/home/feed";
import ModeSelect from "@/components/home/mode";


export default function Home({posts, userId}: { posts: unknown[], userId: string }) {
    const defaultDate = new Date();

    const [dateValue, setDateValue] = useState<Date | null>(defaultDate);
    const [modeValue, setModeValue] = useState<string | null>("Por data");

    return (
        <div className="h-[200vh] mt-8 px-5">
            <div className="flex flex-row gap-3 w-full">
                <ModeSelect value={modeValue} setValue={setModeValue} />
                {modeValue === "Por data" && (
                    <CalendarDatePicker value={dateValue} setValue={setDateValue} />
                )}
            </div>
            <Feed dateValue={dateValue!} modeValue={modeValue} posts={posts} userId={userId} />
        </div>
    );
}
