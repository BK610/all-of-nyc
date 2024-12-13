const DomainCard = ({ url }) => {
  if (!url) return null;

  let isUrlFound = !(
    !url.final_url ||
    url.final_url == "Error" ||
    url.final_url == "Not found"
  );

  // Not using this for now. There are too many false negatives
  //   for URLs that have bad status codes but still work.
  // Check if the status code is 2xx or 3xx, indicating a success
  // let status_code_success =
  //   url.status_code.substring(0, 1) == 2 ||
  //   url.status_code.substring(0, 1) == 3;

  let isOGTitleFound = !(
    !url.title ||
    url.title == "Error" ||
    url.title == "Not found"
  );

  let isOGImageFound = !(
    !url.image ||
    url.image == "Error" ||
    url.image == "Not found"
  );

  return (
    <a
      href={isUrlFound ? url.final_url : ""}
      target={isUrlFound ? "_blank" : ""}
      rel="noopener noreferrer"
      className={`inline-block w-full mb-4 overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl
        ${isUrlFound ? "" : "pointer-events-none bg-gray-100 opacity-70"}`} // Set disabled-esque styling if found_url is false
    >
      {isOGImageFound ? (
        <div className="w-full">
          <img
            className="object-cover w-full h-52 border-b-2"
            src={url.image}
          />
        </div>
      ) : (
        ""
      )}
      <div className="p-5">
        <h2 className="text-nyc-blue text-xl font-semibold mb-2">
          {url.domain_name}&nbsp;
          {isUrlFound ? <>{isOGTitleFound ? "✅" : "❓"}</> : "💀"}
        </h2>
        <p className="mb-1">
          <b>Title:</b> {isUrlFound ? url.title : "N/A"}
        </p>
        <p className="mb-1 line-clamp-3">
          <b>Description:</b> {isUrlFound ? url.description : "N/A"}
        </p>
        <p className="text-gray-600 pt-2 w-full border-t-2">
          Final URL: {url.final_url}
          <br />
          Registered: {url.domain_registration_date}
        </p>
      </div>
    </a>
  );
};

export default DomainCard;
