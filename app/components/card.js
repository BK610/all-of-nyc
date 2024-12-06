const Card = ({ url }) => {
  if (!url) return null; // Handle null or undefined objects gracefully

  // Check if we successfully got info about the URL
  let found_url = !(
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

  // Check if we successfully got an Open Graph title
  let found_title = !(
    !url.title ||
    url.title == "Error" ||
    url.title == "Not found"
  );

  // Check if we successfully got an Open Graph image
  let found_image = !(
    !url.image ||
    url.image == "Error" ||
    url.image == "Not found"
  );

  return (
    <a
      href={found_url ? url.final_url : ""} // Set href to "" if found_url is false
      target={found_url ? "_blank" : ""} // Set target to "" if found_url is false
      rel="noopener noreferrer"
      className={`inline-block w-full mb-4 overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl
        ${found_url ? "" : "pointer-events-none bg-gray-100 opacity-70"}`} // Set disabled-esque styling if found_url is false
    >
      {found_image ? <img className="w-full border-b-2" src={url.image} /> : ""}
      <div className="p-5 whitespace-pre">
        <h2 className="text-nyc-blue text-xl font-semibold mb-2">
          {url.url}&nbsp;
          {found_url ? <>{found_title ? "✅" : "❓"}</> : "💀"}
        </h2>
        <p className="mb-1">
          <b>Title:</b> {found_url ? url.title : "N/A"}
        </p>
        <p className="mb-1 line-clamp-3">
          <b>Description:</b> {found_url ? url.description : "N/A"}
        </p>
        <p className="text-gray-600 pt-2 w-full border-t-2">
          Final URL: {url.final_url}
          <br />
          Registered: {url.registration_date}
        </p>
      </div>
    </a>
  );
};

export default Card;
