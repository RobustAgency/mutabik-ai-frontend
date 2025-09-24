import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CircleProgressProps {
  progress: number; 
}

const ProjectProgress: React.FC<CircleProgressProps> = ({ progress }) => {
  const baseSize = 200; 
  const mdSize = 260; 
  const lgSize = 328; 

  const strokeWidth = 12;
  const [size, setSize] = React.useState(baseSize);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSize(baseSize);
      } else if (window.innerWidth < 1024) {
        setSize(mdSize);
      } else {
        setSize(lgSize);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full flex">
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white p-6">
        <CardHeader className="flex flex-col ">
          <CardTitle className="font-sans font-semibold text-lg leading-7 tracking-normal text-[#1D2939] text-center sm:text-left">
            Project Progress
          </CardTitle>
          <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085] text-center sm:text-left">
            Based on evidences and controls that has been approved
          </p>
        </CardHeader>

        <CardContent>
          <div className="relative flex justify-center items-center">
            <svg
              width={size}
              height={size / 2 + strokeWidth}
              viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
              className="max-w-full h-auto"
            >
              <path
                d={`M ${strokeWidth / 2},${size / 2} A ${radius},${radius} 0 0,1 ${
                  size - strokeWidth / 2
                },${size / 2}`}
                stroke="#E4E7EC"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
              />
              <path
                d={`M ${strokeWidth / 2},${size / 2} A ${radius},${radius} 0 0,1 ${
                  size - strokeWidth / 2
                },${size / 2}`}
                stroke="#4FD58F"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-500 ease-in-out"
              />
            </svg>
            <div className="absolute top-1/2 sm:top-1/2 -translate-y-1/2 text-center">
              <p className="font-sans font-semibold text-lg sm:text-3xl md:text-4xl text-[#1D2939]">
                {progress.toFixed(2)}
              </p>
              <p className="font-sans font-normal text-xs sm:text-sm text-[#667085]">
                Completed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default ProjectProgress;
