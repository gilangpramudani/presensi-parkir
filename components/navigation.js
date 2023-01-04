import Link from "next/link";
import { useRouter } from "next/router";

function Linkto({ isSelected, title, href }) {
    return (
        <li className={`border-b-2 ${isSelected ? "border-gray-500" : "border-transparent"} `}>
            <Link href={href}>
                {title}
            </Link>
        </li>
    )
}

export default function Navigation() {
    const router = useRouter()
    return (
        <nav className="absolute w-full px-2 top-2">
            <ul className="grid grid-cols-2 gap-4 justify-center items-center content-center m-auto text-center font-semibold text-lg">
                <Linkto title="Presensi" href={"/dashboard"} isSelected={router.asPath == "/dashboard"} />
                <Linkto title="Sesi" href={"/dashboard/sesi"} isSelected={router.asPath == "/dashboard/sesi"} />
            </ul>
        </nav>
    )
}