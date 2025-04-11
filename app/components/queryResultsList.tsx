import DomainCard from "./domainCard";

interface QueryResultsListProps {
  urls: [];
}

export default function QueryResultsList({
  urls,
}: QueryResultsListProps): React.ReactElement {
  return (
    <>
      {urls.length > 0 ? (
        <div className="border-b-2 pb-6 columns-1 md:columns-2 lg:columns-3 gap-5">
          {urls.map((url, index) => (
            <DomainCard key={index} url={url} />
          ))}
        </div>
      ) : (
        <p className="text-center">Loading some sweet, sweet data...</p>
      )}
    </>
  );
}
