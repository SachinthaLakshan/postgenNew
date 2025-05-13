import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

type PropsType = {
    children: ReactNode;
};

export function DashboardLayout({ children }: PropsType) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                <Header />

                <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
