import { useState, useEffect, useCallback } from "react";

export type TestPhase = "idle" | "download" | "upload" | "complete";

export function useSpeedTest() {
	const [speed, setSpeed] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [testPhase, setTestPhase] = useState<TestPhase>("idle");

	const simulateSpeedChange = useCallback((currentSpeed: number, phase: "download" | "upload") => {
		const maxChange = phase === "download" ? 5 : 3;
		const change = Math.random() * maxChange * (phase === "download" ? 1 : -1);
		return Math.round((Math.max(0, Math.min(160, currentSpeed + change)) + Number.EPSILON) * 100) / 100;
	}, []);

	useEffect(() => {
		let animationFrameId: number;
		let lastUpdateTime = Date.now();

		const updateSpeed = () => {
			if (isRunning) {
				const currentTime = Date.now();
				if (currentTime - lastUpdateTime > 50) {
					// Update every 50ms for smoother animation
					setSpeed((prevSpeed) => simulateSpeedChange(prevSpeed, testPhase as "download" | "upload"));
					lastUpdateTime = currentTime;
				}
				animationFrameId = requestAnimationFrame(updateSpeed);
			}
		};

		if (isRunning) {
			animationFrameId = requestAnimationFrame(updateSpeed);
		}

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [isRunning, testPhase, simulateSpeedChange]);

	const startTest = useCallback(() => {
		setIsRunning(true);
		setTestPhase("download");
		setSpeed(0);

		setTimeout(() => {
			setTestPhase("upload");
			setTimeout(() => {
				setTestPhase("complete");
				setIsRunning(false);
			}, 5000);
		}, 5000);
	}, []);

	return { speed, isRunning, testPhase, startTest };
}
