import Link from "next/link";
import Image from "next/image";
import nycLogo from "@/public/nyclogo.png";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AboutPage(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex justify-end">
        <Link href="/">
          <Button
            size="sm"
            className="bg-nyc-blue text-white font-semibold hover:bg-nyc-blue/80 hover:text-white focus:outline-nyc-orange cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>
      <div className="flex">
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
      </div>
      <h1 className="text-3xl font-bold mb-4">About</h1>
      <p className="mb-4">
        <strong>
          All of <code>.nyc</code>
        </strong>{" "}
        is a searchable directory of all websites in{" "}
        <a
          href="https://ownit.nyc/"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          the <code>.nyc</code> domain name program
        </a>
        ,{" "}
        <strong>
          aiming to make it easier to discover and celebrate what folks are
          doing in New York City
        </strong>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Project Overview</h2>
      <p className="mb-2">
        New York City is full of passionate people doing important, meaningful,
        interesting things. But, it&apos;s nearly impossible to keep track of it
        all and find new things to experience and people to meet.
      </p>
      <p className="mb-2">
        Luckily, the{" "}
        <a
          href="https://opendata.cityofnewyork.us/"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          NYC Open Data organization
        </a>{" "}
        maintains a{" "}
        <a
          href="https://data.cityofnewyork.us/Business/-nyc-Domain-Registrations/9cw8-7heb/about_data"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          dataset of all <code>.nyc</code> domain registrations
        </a>
        , providing a view into what folks are up to.
      </p>
      <p className="mb-2">
        This project uses that dataset, enhances it with data scraped from each
        website, and makes the data searchable.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Learn more</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>
          <a
            href="https://docs.google.com/presentation/d/1X9uR8tAmhYy6C-vXJqHU8q9bpN6nJMRSq9aF3D5uqlA/edit?pli=1#slide=id.g346cbed1280_0_0"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            NYC Open Data Week presentation
          </a>{" "}
          - My presentation on this project from March 2025.
        </li>
        <li>
          <a
            href="https://github.com/BK610/all-of-nyc"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            GitHub Repo
          </a>{" "}
          - The code behind this project, all open-source.
        </li>
        <li>
          <a
            href="https://www.nyc.gov/site/forward/initiatives/dotnyc.page"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            NYC Digital Services
          </a>{" "}
          - NYC&apos;s digital services and technology initiatives.
        </li>
        <li>
          <a
            href="https://www.nyc.gov/site/forward/initiatives/dotnyc.page"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            <code>.nyc</code> Domain Program
          </a>{" "}
          - Information about registering <code>.nyc</code> domains.
        </li>
        <li>
          <a
            href="https://www.nyc.gov/site/forward/initiatives/dotnyc.page"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            NYC Open Data
          </a>{" "}
          - NYC&apos;s open data portal.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
      <p className="mb-4">
        For questions, quandaries, complaints, quibbles, or any other quips
        about this project, please contact{" "}
        <a
          href="https://www.baileykane.co/?ref=allofnyc-about"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          Bailey Kane
        </a>
        .
      </p>
    </div>
  );
}
