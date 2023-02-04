import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl">Charity Raffle</h1>
      <div className="flex flex-row items-center">
        <Link href="/" className="mr-4 p-6">
          Home
        </Link>
        <Link href="/admin" className="mr-4 p-6">
          Admin
        </Link>
        <Link href="/buyer" className="mr-4 p-6">
          Buyer
        </Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
