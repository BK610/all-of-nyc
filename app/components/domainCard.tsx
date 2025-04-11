interface DomainCardProps {
  url: any;
}

export default function DomainCard({
  url,
}: DomainCardProps): React.ReactElement {
  if (!url) return null;

  const formattedRegistrationDate = new Date(
    url.domain_registration_date
  ).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const formattedUpdatedDate = new Date(url.last_updated_at).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  return (
    <a
      href={url.is_url_found ? url.final_url : undefined}
      target={url.is_url_found ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`inline-block w-full mb-4 overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl
        ${!url.is_url_found && "pointer-events-none bg-gray-100 opacity-70"}`} // Set disabled-esque styling if found_url is false
    >
      {url.is_og_image_found ? (
        <div className="w-full h-52">
          <img
            className="object-cover w-full h-52 border-b-2"
            src={decodeURI(url.image)}
            alt={`OpenGraph image for ${url.title}`}
          />
        </div>
      ) : (
        ""
      )}
      <div className="p-5">
        <h2 className="text-nyc-blue text-xl font-semibold mb-2">
          {url.domain_name}&nbsp;
          {url.is_url_found ? <>{url.is_og_title_found ? "✅" : "❓"}</> : "💀"}
        </h2>
        <p className="mb-1">
          <b>Title:</b> {url.title}
        </p>
        <p className="mb-1 line-clamp-3">
          <b>Description:</b> {url.description}
        </p>
        <p className="text-gray-600 pt-2 w-full border-t-2">
          Final URL: {url.final_url}
          <br />
          Registered at: {formattedRegistrationDate}
          <br />
          Data updated at: {formattedUpdatedDate}
        </p>
      </div>
    </a>
  );
}
