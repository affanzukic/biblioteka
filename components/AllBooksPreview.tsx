import { useState, useEffect, useRef } from "react"

const tabs = [
    {
        title: "Audio knjige",
        active: true
    },
    {
        title: "Slikovne knjige",
        active: false,
    },
    {
        title: "Video knjige",
        active: false
    }
]

export default function AllBooksPreview() {
    const tabRef = useRef<HTMLDivElement | null>(null)
    return (
        <div id="all-books" className="flex flex-col w-full">
            <div id="tabs" className="flex flex-row bg-transparent space-x-2 h-full min-w-full">
                {tabs.map((tab, idx) => {
                    return (
                        <div id={tab.title} key={idx} className={`flex p-2 cursor-pointer rounded-t-sm dark:bg-gray-900 bg-white ${tab.active && "border-b-2 border-yellow-600"}`} ref={tabRef}>
                            <p>{tab.title}</p>
                        </div>
                    )
                })}
            </div>
            <div id="content" className="flex mt-4 dark:bg-black bg-white rounded-lg">
                {tabs[0].active ? null : null}
                {tabs[1].active ? null : null}
                {tabs[2].active ? null : null}
                <p className="text-center mx-auto">Content TBA</p>
            </div>
        </div>
    )
}