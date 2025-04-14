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
    <div className="columns-1 md:columns-2 lg:columns-3 space-y-4">
      {loading
        ? [...Array(15)].map((index) => <SkeletonDomainCard key={index} />)
        : urls.map((url) => <DomainCard key={url.domain_name} url={url} />)}
    </div>
  );
}
