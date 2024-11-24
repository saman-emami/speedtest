export type DialProps = React.HTMLAttributes<SVGElement> & {
	divisionCount: number;
	min: number;
	max: number;
	maxSize?: number;
	strokeWidth: number;
	value: SpeedMeterValue;
	divisionLineRender: (position: DivisionLinePosition, isSubDivision: boolean) => React.ReactNode;
	divisionLabelRender: (position: DivisionLabelPosition, value: string, isSubDivision: boolean) => React.ReactNode;
};

type SpeedMeterValue = number | `${number}`;

export type SpeedMeterProps = React.HTMLAttributes<HTMLDivElement> & {
	min: number;
	max: number;
	divisionCount: number;
	value: SpeedMeterValue;
	maxSize?: number;
};

export type DivisionLinePosition = { x1: number; x2: number; y1: number; y2: number };

export type DivisionLineProps = React.SVGLineElementAttributes<SVGLineElement>;

export type DivisionLabelPosition = { x: number; y: number };

export type DivisionLabelProps = Omit<
	React.SVGTextElementAttributes<SVGTextElement>,
	"textAnchor" | "dominantBaseline"
>;

export type NeedleProps = React.HTMLAttributes<HTMLDivElement> & { value: SpeedMeterValue; min: number; max: number };
