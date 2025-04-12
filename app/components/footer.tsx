interface FooterProps {}

export default function Footer({}: FooterProps): React.ReactElement {
  return (
    <footer className="w-full py-4 h-fit text-center flex flex-col">
      <div className="mx-auto flex flex-col sm:flex-row gap-4 sm:gap-2 text-sm">
        <div className="m-auto">
          <a
            className="px-2 py-1 rounded-sm shadow-lg hover:shadow-2xl
          hover:outline-2 outline-primary bg-gradient-to-br from-amber-200 to-amber-300
          "
            href="https://data.cityofnewyork.us/Business/-nyc-Domain-Registrations/9cw8-7heb/about_data"
            target="_blank"
          >
            Powered by <b>NYC Open Data</b>.
          </a>
        </div>
        <div className="m-auto">
          <a
            className="px-2 py-1 rounded-sm shadow-lg hover:shadow-2xl
          hover:outline-2 outline-primary bg-gradient-to-br from-amber-200 to-amber-300 hover:from-amber-100 hover:to-amber-200
          "
            href="https://www.baileykane.co/?ref=allof.nyc"
            target="_blank"
          >
            Built by <b>Bailey Kane</b>, for fun!
          </a>
        </div>
      </div>
    </footer>
  );
}
