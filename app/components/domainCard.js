/** Code Feedback - Good enapasulation; Consider a more precise name
 *
 * The name "Card" sounds like a generic. "DomainCard" or "UrlCard" might be more descriptive.
 */
const DomainCard = ({ url }) => {
  if (!url) return null; // Handle null or undefined objects gracefully

  // Check if we successfully got info about the URL
  let isUrlFound = !(
    !url.final_url ||
    url.final_url == "Error" ||
    url.final_url == "Not found"
  );
  /** Code Feedback - great use of using intermediate variables
   *
   * I really like using that you're encapsulating the logic for checking if the URL is found
   * in a variable. It makes the code easier to read and understand.
   *
   * One pattern that's common for naming these variables is to use the word "is" or "has" at the beginning.
   * For example, you could name this variable "isUrlFound" or "hasUrl".
   *
   * "found_url" is pretty good, but it seems like it could also be a string, like it's the url you found.
   *
   * The "is" pattern is common so it's something another developer would understand quickly.
   *
   * (remove the comments above them, though. Your great names are enough.)
   */

  // Not using this for now. There are too many false negatives
  //   for URLs that have bad status codes but still work.
  // Check if the status code is 2xx or 3xx, indicating a success
  // let status_code_success =
  //   url.status_code.substring(0, 1) == 2 ||
  //   url.status_code.substring(0, 1) == 3;

  // Check if we successfully got an Open Graph title
  let isTitleFound = !(
    !url.title ||
    url.title == "Error" ||
    url.title == "Not found"
  );

  // Check if we successfully got an Open Graph image
  let isImageFound = !(
    !url.image ||
    url.image == "Error" ||
    url.image == "Not found"
  );

  /** Musings
   *
   * One risk of leaving overly verbose comments in place is that it
   * can kind of look like you might have used copilot to write the code.
   *
   * Like one thing I have done is write a comment, let copilot write the code,
   * review it, and remove the comment.
   *
   * I think doing it this way is ok, but it's good to remove the comments because they
   * are no longer needed. Also, I think if someone is evaluating a junior engineer's code,
   * they want to be sure that you wrote the code yourself and understand it.
   */

  return (
    <a
      href={isUrlFound ? url.final_url : ""} // Set href to "" if found_url is false
      target={isUrlFound ? "_blank" : ""} // Set target to "" if found_url is false
      rel="noopener noreferrer"
      className={`inline-block w-full mb-4 overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl
        ${isUrlFound ? "" : "pointer-events-none bg-gray-100 opacity-70"}`} // Set disabled-esque styling if found_url is false
    >
      {isImageFound ? (
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
          {url.url}&nbsp;
          {isUrlFound ? <>{isTitleFound ? "✅" : "❓"}</> : "💀"}
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
          Registered: {url.registration_date}
        </p>
      </div>
    </a>
  );
};

export default DomainCard;
