"use client";

import { useSpeedTest } from "@/hooks/useSpeedTest";
import React, { FC, useState } from "react";
import ClientOnly from "@/components/ClientOnly";
import SpeedMeter from "@/components/SpeedMeter";
import { ArrowUpCircle, ArrowDownCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SpeedTest: FC = () => {
	const [divisionCount, setDivisionCount] = useState(8);
	const { speed, isRunning, startTest, testPhase } = useSpeedTest();

	return (
		<div className="w-full px-8">
			<div className="relative drop-shadow-[0_0_60px_hsl(var(--primary))]">
				<ClientOnly
					fallback={
						<div className="h-[min(100vw_-_8rem,_550px)] flex items-center justify-center">
							<Loader2 className="stroke-primary animate-spin" />
						</div>
					}
				>
					<SpeedMeter min={0} max={160} value={speed} maxSize={550} divisionCount={divisionCount} />
					<div className={"absolute left-0 right-0 top-0 bottom-6 flex items-end justify-center"}>
						<div className="flex items-center gap-3 font-semibold">
							{testPhase === "download" && (
								<>
									Testing download speed...
									<ArrowDownCircle className="stroke-blue-500 animate-pulse" />
								</>
							)}
							{testPhase === "upload" && (
								<>
									Testing upload speed...
									<ArrowUpCircle className="stroke-purple-500 animate-pulse" />
								</>
							)}
							{testPhase === "complete" && (
								<>
									Test completed
									<CheckCircle2 className="stroke-green-500" />
								</>
							)}
						</div>
					</div>
					<div className={"absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center flex-col gap-2"}>
						{(isRunning || testPhase === "complete") && (
							<div className="flex items-center justify-center">
								<p className="text-[3rem] md:text-[5rem] font-semibold">{speed}</p>
								<span>Mbps</span>
							</div>
						)}

						{testPhase === "idle" && (
							<p
								className="transition-all text-[3rem] md:text-[5rem] font-semibold cursor-pointer hover:scale-125"
								onClick={() => startTest()}
							>
								GO!
							</p>
						)}

						{testPhase === "complete" && <Button onClick={() => startTest()}>Retry?</Button>}
					</div>
				</ClientOnly>
			</div>
			<div className="flex items-center justify-center gap-5">
				<Label htmlFor="divisionCountSelect">Divisions:</Label>
				<Select value={divisionCount.toString()} onValueChange={(value) => setDivisionCount(Number(value))}>
					<SelectTrigger id="divisionCountSelect" className="w-[180px]">
						<SelectValue placeholder="Number of divisions" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="4">5</SelectItem>
							<SelectItem value="8">8</SelectItem>
							<SelectItem value="16">10</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

export default SpeedTest;
