import { useEffect, useState } from "react";

const NotebookEmbed = ({ src, fallbackUrl }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch(src)
      .then((response) => response.text())
      .then((data) => setHtml(data));
  }, [src]);

  return (
    <div className="w-full py-10">
      {html ? (
        <p>
          The{" "}
          <a
            href="https://jupyter.org/"
            target="_blank"
            className="text-nyc-blue hover:text-nyc-blue hover:underline"
          >
            Jupyter Notebook
          </a>{" "}
          with analysis on the .nyc URLs isn&apos;t rendering correctly. View
          the source at{" "}
          <a
            href={fallbackUrl}
            target="_blank"
            className="text-nyc-blue hover:text-nyc-blue hover:underline"
          >
            {fallbackUrl}
          </a>
          .
        </p>
      ) : (
        <div className="w-full" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  );
};

export default NotebookEmbed;
