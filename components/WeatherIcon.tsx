/** @format */

import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface WeatherIconProps extends React.HTMLProps<HTMLDivElement> {
  iconName: string;
}

export default function WeatherIcon({ iconName, className, ...props }: WeatherIconProps) {
  return (
    <div 
      title={iconName} 
      {...props} 
      className={cn("relative h-20 w-20", className)}
    >
      <Image
        width={100}
        height={100}
        alt="weather-icon"
        className="absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${iconName}@4x.png`}
      />
    </div>
  );
}