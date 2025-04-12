import { MoveRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DomainCardProps {
  url: any;
}

export default function DomainCard({
  url,
}: DomainCardProps): React.ReactElement {
  if (!url) return null;

  const formattedRegistrationDate = new Date(
    url.domain_registration_date
  ).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const formattedUpdatedDate = new Date(url.last_updated_at).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  const status = url.is_url_found
    ? url.is_og_title_found
      ? "✅ Complete"
      : "❓ Live"
    : "💀 Down";

  return (
    <Card
      className={`gap-2 w-full overflow-hidden text-primary rounded-lg shadow-lg hover:shadow-xl transition-all duration-75
        outline outline-nyc-medium-gray focus:outline-4 focus:outline-nyc-orange focus-within:outline-4 focus-within:outline-nyc-orange
        bg-gray-50 hover:bg-gradient-to-br hover:from-gray-50 hover:to-amber-50 focus-within:bg-gradient-to-br focus:bg-gradient-to-br from-white to-amber-100 hover:focus:from-white hover:focus:to-amber-100
      ${!url.is_url_found && "pointer-events-none opacity-70"}`} // Set disabled-esque styling if found_url is false
      tabIndex={0}
    >
      <CardHeader className="gap-2">
        <CardTitle className="pb-2 w-full overflow-hidden">
          <div className="space-y-0.5 w-full overflow-hidden">
            <label
              htmlFor="domainName"
              className="text-gray-700 font-semibold text-sm"
            >
              Domain Name
            </label>
            <h2
              id="domainName"
              className="w-full font-mono text-xl text-nowrapp truncate"
            >
              {url.domain_name}
            </h2>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="text-base text-gray-700 space-y-0.5">
            <h3 className=" font-semibold text-sm">Title</h3>
            <p className="line-clamp-2">{url.title}</p>
          </div>
        </CardDescription>
        {url.is_og_image_found ? (
          <AspectRatio ratio={1200 / 627}>
            <div className="h-full w-full rounded-md bg-nyc-medium-gray">
              <img
                className="h-full w-full object-cover rounded-md shadow-md"
                src={decodeURI(url.image)}
                alt={`OpenGraph image for ${url.domain_name}`}
              />
            </div>
          </AspectRatio>
        ) : null}
      </CardHeader>
      <CardContent className="grow flex flex-col gap-2">
        <div className="h-full flex flex-col gap-2">
          <div className="text-base text-gray-700 space-y-0.5">
            <p className="font-semibold text-sm">Description</p>
            <p className="line-clamp-5">{url.description}</p>
          </div>
        </div>
        <CardAction className="w-full">
          <Button
            className="w-full font-semibold hover:bg-accent text-white"
            asChild
          >
            <a
              href={url.is_url_found ? url.final_url : undefined}
              target={url.is_url_found ? "_blank" : undefined}
            >
              Visit <MoveRight />
            </a>
          </Button>
        </CardAction>
      </CardContent>
      <CardFooter>
        <Accordion className="w-full overflow-hidden" type="single" collapsible>
          <AccordionItem value="metadata">
            <AccordionTrigger className="font-semibold text-gray-700 hover:cursor-pointer">
              View metadata
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <ul className="font-mono list-inside border border-gray-300 bg-nyc-medium-gray rounded-md px-1 py-1 overflow-y-hidden overflow-x-auto text-nowrap">
                <li>
                  Status:{" "}
                  <Badge className="font-semibold" variant="secondary">
                    {status}
                  </Badge>
                </li>
                <li>Final URL: {url.final_url}</li>
                <li>Registered: {formattedRegistrationDate}</li>
                <li>Updated: {formattedUpdatedDate}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}

export function SkeletonDomainCard(): React.ReactElement {
  return (
    <Card
      className={`gap-2 w-full overflow-hidden text-primary rounded-lg shadow-lg hover:shadow-xl transition-all duration-75
        outline outline-nyc-medium-gray focus:outline-4 focus:outline-nyc-orange focus-within:outline-4 focus-within:outline-nyc-orange
        bg-gray-50 hover:bg-white focus-within:bg-gradient-to-br focus:bg-gradient-to-br from-white to-amber-100
      `}
      tabIndex={-1}
    >
      <CardHeader className="gap-2">
        <CardTitle className="pb-2 w-full overflow-hidden">
          <div className="space-y-0.5 w-full overflow-hidden">
            <label
              htmlFor="domainName"
              className="text-gray-700 font-semibold text-sm"
            >
              Domain Name
            </label>
            <h2
              id="domainName"
              className="w-full font-mono text-xl text-nowrapp truncate"
            >
              <Skeleton className="bg-nyc-medium-gray h-7 w-1/2" />
            </h2>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="text-base text-gray-700 space-y-0.5">
            <h3 className=" font-semibold text-sm">Title</h3>
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
          </div>
        </CardDescription>
        <AspectRatio ratio={1200 / 627}>
          <Skeleton className="bg-nyc-medium-gray h-full w-full" />
        </AspectRatio>
      </CardHeader>
      <CardContent className="grow flex flex-col gap-2">
        <div className="h-full flex flex-col gap-2">
          <div className="text-base text-gray-700 space-y-1">
            <p className="font-semibold text-sm">Description</p>
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
          </div>
        </div>
        <CardAction className="w-full">
          <Button className="w-full font-semibold hover:bg-accent text-white">
            <Skeleton className="bg-gray-600 h-5 w-20" />
          </Button>
        </CardAction>
      </CardContent>
      <CardFooter>
        <Accordion className="w-full overflow-hidden" type="single" collapsible>
          <AccordionItem value="metadata">
            <AccordionTrigger className="font-semibold text-gray-700 hover:cursor-pointer">
              View metadata
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
