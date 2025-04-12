interface FooterProps {}

const links = [
  {
    href: "https://data.cityofnewyork.us/Business/-nyc-Domain-Registrations/9cw8-7heb/about_data",
    innerHtml: (
      <>
        Powered by <b>NYC Open Data</b>
      </>
    ),
  },
  {
    href: "https://www.baileykane.co/?ref=allof.nyc",
    innerHtml: (
      <>
        Built by <b>Bailey Kane</b>, for fun!
      </>
    ),
  },
];

export default function Footer({}: FooterProps): React.ReactElement {
  return (
    <footer className="w-full py-6 h-fit text-center flex flex-col">
      <div className="mx-auto flex flex-col sm:flex-row gap-4 sm:gap-2 text-sm">
        {links.map((link) => (
          <div className="m-auto">
            <a
              className="px-2 py-1 rounded-sm shadow-lg hover:shadow-2xl
          hover:outline-2 outline-primary bg-gradient-to-br from-amber-200 to-amber-300 hover:from-amber-100 hover:to-amber-200
          "
              href={link.href}
              target="_blank"
            >
              {link.innerHtml}
            </a>
          </div>
        ))}
      </div>
    </footer>
  );
}
