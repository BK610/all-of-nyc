import DomainCard, { SkeletonDomainCard } from "@/components/domainCard";

interface QueryResultsListProps {
  urls: any[];
  loading: boolean;
}

export default function QueryResultsList({
  urls,
  loading,
}: QueryResultsListProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <p className={`w-full text-center ${loading ? "visible" : "invisible"}`}>
        <b>Loading some sweet, sweet data...</b>
      </p>
      <div className="columns-1 md:columns-2 lg:columns-3 space-y-4">
        {loading
          ? [...Array(15)].map((index) => <SkeletonDomainCard key={index} />)
          : urls.map((url, index) => <DomainCard key={index} url={url} />)}
      </div>
    </div>
  );
}
