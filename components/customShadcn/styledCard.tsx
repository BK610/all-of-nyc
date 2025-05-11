import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardAction,
} from "@/components/ui/card";

interface CustomCardProps {
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export default function StyledCard({
  className,
  children,
  ...props
}: CustomCardProps): React.ReactElement {
  return (
    <Card
      className={`${className} gap-2 w-full overflow-hidden text-primary rounded-lg shadow-lg hover:shadow-xl transition-all duration-75
        outline outline-nyc-medium-gray hover:outline-nyc-blue focus:outline-nyc-orange focus:outline-4 focus-within:outline-4 focus-within:outline-nyc-orange hover:focus-within:outline-nyc-orange
        bg-gradient-to-br from-gray-50 to-gray-50
        hover:not-focus:to-amber-50
        focus:from-white focus:to-amber-100
        focus-within:from-white focus-within:to-amber-100
        hover:focus-within:from-white hover:focus-within:to-amber-100`}
      {...props}
    >
      {children}
    </Card>
  );
}
