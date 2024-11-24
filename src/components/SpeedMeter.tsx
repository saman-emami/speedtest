"use client";

import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import {
	DialProps,
	DivisionLabelPosition,
	DivisionLabelProps,
	DivisionLinePosition,
	DivisionLineProps,
	NeedleProps,
	SpeedMeterProps,
} from "./SpeedMeter.types";

const SpeedMeter: React.FC<SpeedMeterProps> = ({
	className,
	min,
	max,
	value,
	divisionCount,
	maxSize = 200,
	...props
}) => {
	const { size, containerRef } = useResponsiveSize(maxSize);

	return (
		<div ref={containerRef} className={cn("relative w-full flex justify-center items-center", className)} {...props}>
			<Dial
				min={min}
				max={max}
				divisionCount={divisionCount}
				maxSize={size}
				strokeWidth={12}
				value={value}
				divisionLabelRender={(position, labelValue, isSubDivision) =>
					isSubDivision ? null : (
						<DivisionLabel
							x={position.x}
							y={position.y}
							className={cn({
								"text-2xl md:text-[2.5rem] font-semibold":
									Number(value) >= Number(labelValue) &&
									Number(value) - Number(labelValue) < (max - min) / divisionCount,
							})}
						>
							{labelValue}
						</DivisionLabel>
					)
				}
				divisionLineRender={(position, isSubDivision) => (
					<DivisionLine
						className={cn({ "stroke-muted-foreground": isSubDivision })}
						x1={position.x1}
						y1={position.y1}
						x2={position.x2}
						y2={position.y2}
					/>
				)}
			/>
			<Needle value={value} min={min} max={max} />
		</div>
	);
};

const Needle: React.FC<NeedleProps> = ({ className, value, style, min, max, ...props }) => {
	const angle = ((Number(value) - min) / (max - min)) * 270 - 135;

	return (
		<div
			className={cn(
				"absolute top-1/2 left-1/2 w-3 h-[28%] origin-bottom transform -translate-x-1/2 -translate-y-full rounded-full transition-transform bg-gradient-to-t from-transparent to-primary",
				className
			)}
			style={{ transform: `translateX(-50%) translateY(-100%) rotate(${angle}deg)`, ...style }}
			{...props}
		/>
	);
};

const Dial: React.FC<DialProps> = ({
	divisionCount,
	min,
	max,
	divisionLineRender,
	divisionLabelRender,
	value,
	maxSize = 200,
	className,
	strokeWidth,
	...props
}) => {
	const { center, radius, divisions, circumference, progressOffset, pathData } = useMemo(() => {
		// calculations for the divisions
		const maxSubDivisionCount = 32;

		const subDivisionPerDivision = Math.round(maxSubDivisionCount / divisionCount);
		const subDivisionCount = divisionCount * subDivisionPerDivision;

		const center = maxSize / 2;
		const radius = (maxSize - strokeWidth) / 2; // stroke width should be subtracted from the size of the dial to prevent overflowing
		const startAngle = -225; // -(180 + 45) degrees
		const endAngle = 45; // 45 degrees
		const angleRange = startAngle - endAngle;

		const divisions = [];
		for (let i = 0; i <= subDivisionCount; i++) {
			const angle = startAngle - (i / subDivisionCount) * angleRange;
			const radians = (angle * Math.PI) / 180;

			const isSubDivision = i % subDivisionPerDivision !== 0;

			const linePosition: DivisionLinePosition = {
				x1: Math.round(center + radius * (isSubDivision ? 0.86 : 0.82) * Math.cos(radians)),
				y1: Math.round(center + radius * (isSubDivision ? 0.86 : 0.82) * Math.sin(radians)),
				x2: Math.round(center + radius * 0.9 * Math.cos(radians)),
				y2: Math.round(center + radius * 0.9 * Math.sin(radians)),
			};

			const labelRadius = radius * 0.68;

			const labelPosition: DivisionLabelPosition = {
				x: Math.round(center + labelRadius * Math.cos(radians)),
				y: Math.round(center + labelRadius * Math.sin(radians)),
			};

			const value = min + (i / subDivisionCount) * (max - min);

			divisions.push(
				<g key={i}>
					{divisionLineRender(linePosition, isSubDivision)}
					{divisionLabelRender(labelPosition, value.toFixed(0), isSubDivision)}
				</g>
			);
		}

		// calculations for the radial progress bar
		const startX = maxSize / 2 + radius * Math.cos((startAngle * Math.PI) / 180);
		const startY = maxSize / 2 + radius * Math.sin((startAngle * Math.PI) / 180);
		const endX = maxSize / 2 + radius * Math.cos((endAngle * Math.PI) / 180);
		const endY = maxSize / 2 + radius * Math.sin((endAngle * Math.PI) / 180);

		const circumference = radius * Math.PI * 1.5; // 3/4 of a full circle
		const progressPercentage = ((Number(value) - min) / (max - min)) * 100;
		const progressOffset = circumference - (progressPercentage / 100) * circumference;

		const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

		const pathData = `
    M ${startX} ${startY}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
  `;

		return { center, radius, divisions, startAngle, endAngle, circumference, progressOffset, pathData };
	}, [maxSize, strokeWidth, divisionCount, divisionLabelRender, divisionLineRender, max, min]);

	return (
		<svg
			width={maxSize}
			height={maxSize}
			viewBox={`0 0 ${maxSize} ${maxSize}`}
			className={cn("text-gray-80", className)}
			{...props}
		>
			<circle
				className="stroke-primary"
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				strokeLinecap="round"
				strokeWidth={strokeWidth}
				strokeDasharray={`${(3 * Math.PI * radius) / 2} ${2 * Math.PI * radius}`}
				transform={`rotate(135 ${center} ${center})`}
			/>
			<path
				className="transition-all stroke-foreground"
				d={pathData}
				fill="none"
				strokeWidth={strokeWidth}
				strokeDasharray={circumference}
				strokeDashoffset={progressOffset}
				strokeLinecap="round"
			/>
			{divisions}
		</svg>
	);
};

const DivisionLabel: React.FC<DivisionLabelProps> = ({ children, className, ...props }) => {
	return (
		<text
			className={cn("text-md md:text-lg transition-all fill-foreground", className)}
			textAnchor="middle"
			dominantBaseline="middle"
			{...props}
		>
			{children}
		</text>
	);
};

const DivisionLine: React.FC<DivisionLineProps> = ({ children, className, strokeLinecap = "square", ...props }) => {
	return (
		<line
			className={cn("stroke-primary stroke-[0.25rem] rounded-full", className)}
			strokeLinecap={strokeLinecap}
			{...props}
		>
			{children}
		</line>
	);
};

export default SpeedMeter;
