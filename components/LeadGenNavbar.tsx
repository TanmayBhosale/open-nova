import Image from "next/image"
import Link from "next/link"
import logo from "../assets/logo.svg"

function LeadGenNavbar(){
    return(
        <nav className="theme-bg-accent w-1/6 min-h-screen fixed">
      <div className="flex flex-row mt-20 justify-center items-center">
        <Image width="45%" height="45%" src={logo} />
        <p className="ml-3 theme-text font-medium text-2xl">LeadGen</p>
      </div>
      <ul className="mt-48 flex flex-col items-start pl-8 theme-text font-medium text-xl">
        <li
          className={
            "mb-2 w-full py-3 pl-5 rounded-l-full"
          }
        >
          <Link href="/leadGen">
            <a>Home</a>
          </Link>
        </li>
        <li
          className={
            "mb-2 w-full py-3 pl-5 rounded-l-full"
          }
        >
            Find Users By
            <ul className="ml-6 mt-3">
                <li>
                    <Link href="/leadGen/find-by/search">
                        <a>Search</a>
                    </Link>
                </li>
            </ul>
        </li>
        <li
          className={
            "mb-7 w-full py-2 pl-5 rounded-l-2xl"
          }
        >
            My Lists
        </li>
      </ul>
    </nav>
    )
}

export default LeadGenNavbar