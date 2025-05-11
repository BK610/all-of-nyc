import DomainCard, { SkeletonDomainCard } from "@/components/domainCard";

interface QueryResultsListProps {
  urls: any[];
  loading: boolean;
  totalUrlsCount: number;
}

export default function QueryResultsList({
  urls,
  loading,
  totalUrlsCount,
}: QueryResultsListProps): React.ReactElement {
  return (
    <div>
      <p className={`w-full text-center pb-2`}>
        {loading ? (
          <>Loading some sweet, sweet data...</>
        ) : (
          <>
            Showing <b>{urls.length}</b> of <b>{totalUrlsCount}</b> matching{" "}
            <code>.nyc</code> domains.
          </>
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? [...Array(15)].map((index) => <SkeletonDomainCard key={index} />)
          : urls.map((url) => <DomainCard key={url.domain_name} url={url} />)}
      </div>
    </div>
  );
}
