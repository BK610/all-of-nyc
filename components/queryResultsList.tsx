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
      <div className="columns-1 md:columns-2 lg:columns-3 space-y-4">
        {loading
          ? [...Array(15)].map((index) => <SkeletonDomainCard key={index} />)
          : urls.map((url) => (
              <DomainCard
                key={url.domain_name}
                url={url}
                layoutId={url.domain_name}
              />
            ))}
      </div>
    </div>
  );
}
