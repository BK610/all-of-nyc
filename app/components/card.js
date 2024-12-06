const Card = ({ url }) => {
  return (
    <a
      href={url.final_url ? url.final_url : ""}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl
            `}
    >
      <h2 className="text-nyc-blue text-xl font-semibold mb-2">{url.url}</h2>
      <p className="text-gray-600 mt-2">Registered: {url.registration_date}</p>
    </a>
  );
};

export default Card;
