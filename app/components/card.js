const Card = ({ url }) => {
  if (!url) return null; // Handle null or undefined objects gracefully

  let found_url = true;

  // Check if we successfully got info about the URL
  if (
    !url.final_url ||
    url.final_url == "Error" ||
    url.final_url == "Not found"
  ) {
    found_url = false;
  }

  let found_image = true;

  // Check if we successfully got an Open Graph image
  if (!url.image || url.image == "Error" || url.image == "Not found") {
    found_image = false;
  }

  return (
    <a
      href={found_url ? url.final_url : ""} // Set href to "" if found_url is false
      target={found_url ? "_blank" : ""} // Set target to "" if found_url is false
      rel="noopener noreferrer"
      className={`block bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl
        ${found_url ? "" : "pointer-events-none bg-gray-100 opacity-70"}`} // Set disabled-esque styling if found_url is false
    >
      {found_image ? <img className="w-full border-b-2" src={url.image} /> : ""}
      <div className="p-6">
        <h2 className="text-nyc-blue text-xl font-semibold mb-2">
          {url.url}&nbsp;
          {found_url ? "✅" : "💀"}
        </h2>
        <p className="mb-1">
          <b>Title:</b> {found_url ? url.title : "N/A"}
        </p>
        <p className="mb-1 line-clamp-3">
          <b>Description:</b> {found_url ? url.description : "N/A"}
        </p>
        <p className="text-gray-600 pt-1 w-full border-t-2">
          Registered: {url.registration_date}
        </p>
      </div>
    </a>
  );
};

export default Card;
