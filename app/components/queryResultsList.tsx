import DomainCard from "./domainCard";

interface QueryResultsListProps {
  urls: any[];
}

export default function QueryResultsList({
  urls,
}: QueryResultsListProps): React.ReactElement {
  return (
    <>
      {urls.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 space-y-4">
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
