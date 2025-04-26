import Image from "next/image";
import nycLogo from "/public/nycLogo.png";
import Link from "next/link";
export default function HomeHeader(): React.ReactElement {
  return (
    <section>
      <div className="max-w-6xl">
        <Link href="/about">What's this about?</Link>
      </div>
      <div className="mb-4 text-center w-fit mx-auto">
        <Link href="/" className="w-fit mx-auto hover:underline">
          <h1 className="text-3xl font-bold text-nyc-blue mb-2">
            All of{" "}
            <Image
              className="inline w-20 h-20"
              src={nycLogo}
              alt="Logo of the .nyc domain registration program."
            />
          </h1>
        </Link>
        <h2 className="text-xl mb-2">
          Discover how{" "}
          <a
            href="https://www.ownit.nyc/"
            target="_blank"
            className="bg-gray-50 rounded-md px-1 outline outline-nyc-medium-gray hover:outline-nyc-blue"
          >
            <code className="">.nyc</code>
          </a>{" "}
          is used.
        </h2>
      </div>
    </section>
  );
}
