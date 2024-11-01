import { cn } from "@/lib/utils";

interface DottedSeperatorProps {
    className?: string;
    color?: string;
    height?: string;
    dotSize?: string;
    gapSize?: string;
    directon?: "horizontal" | "vertical";
}

export const DottedSeperator = ({
    className,
    color = "#d4d4d8",
    height = "2px",
    gapSize = "6px",
    dotSize = "2px",
    directon = "horizontal"
}: DottedSeperatorProps) => {
    const isHorizontal = directon === "horizontal";

    return (
        <div className={cn(
            isHorizontal ? "w-full flex items-center" : "h-full flex flex-col items-center",
            className
        )}>
            <div className={isHorizontal ? "flex-grow" : "flex-grow-0"} style={{
                width: isHorizontal ? "100%" : height,
                height: isHorizontal ? height : "100%",
                backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
                backgroundSize: isHorizontal ? `${parseInt(gapSize) + parseInt(dotSize)}px ${height}`
                    : `${height} ${parseInt(gapSize) + parseInt(dotSize)}px`,
                backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
                backgroundPosition: "center",
            }}></div>
        </div>
    );
};
