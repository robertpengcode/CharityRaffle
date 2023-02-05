import { ConnectButton, Button } from "web3uikit";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="p-2 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-2 px-2 font-bold text-3xl text-sky-800">
        Charity Raffle
      </h1>
      <div className="flex flex-row items-center">
        <Link
          href="/"
          className="mr-4 p-4 font-bold text-sky-700 hover:text-sky-500"
        >
          Home
        </Link>
        <Link
          href="/admin"
          className="mr-4 p-4 font-bold text-sky-700 hover:text-sky-500"
        >
          Admin
        </Link>
        <Link
          href="/buyer"
          className="mr-4 p-4 font-bold text-sky-700 hover:text-sky-500"
        >
          Buyer
        </Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
