import Image from "next/image";
import nycLogo from "/public/nycLogo.png";

export default function HomeHeader(): React.ReactElement {
  return (
    <div className="mb-4 text-center">
      <h1 className="text-3xl font-bold text-nyc-blue mb-2">
        All of{" "}
        <Image
          className="inline w-20 h-20"
          src={nycLogo}
          alt="Logo of the .nyc domain registration program."
        />
      </h1>
      <h2 className="text-xl mb-2">Discover how .nyc domains are used.</h2>
    </div>
  );
}
