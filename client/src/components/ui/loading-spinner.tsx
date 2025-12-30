import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

export const LoadingSpinner = ({ className, ...props }: LoadingSpinnerProps) => {
    return (
        <Loader2
            className={cn("h-8 w-8 animate-spin text-primary", className)}
            {...props}
        />
    );
};
