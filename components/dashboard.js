import Kepala from "./kepala";
import Navigation from "./navigation";
import { Notification } from "./notifikasi";

export default function Dashboard({ title, children }) {
    return (
        <>
            <Kepala title={title} />
            <Notification />
            <main className="px-5 py-6 h-screen">
                {/* <Navigation /> */}
                {children}
            </main>
        </>
    )
}