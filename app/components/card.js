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

  return (
    <a
      href={found_url ? url.final_url : ""} // Set href to "" if found_url is false
      target={found_url ? "_blank" : ""} // Set target to "" if found_url is false
      rel="noopener noreferrer"
      className={`block bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl
        ${found_url ? "" : "pointer-events-none bg-gray-100 opacity-70"}`} // Set disabled-esque styling if found_url is false
    >
      <h2 className="text-nyc-blue text-xl font-semibold mb-2">
        {url.url}&nbsp;
        {found_url ? "✅" : "💀"}
      </h2>
      <p className="text-gray-600 mt-2">Registered: {url.registration_date}</p>
    </a>
  );
};

export default Card;
