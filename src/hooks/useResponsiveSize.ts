import { useState, useEffect, useRef } from "react";

export function useResponsiveSize(maxSize: number) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState(maxSize);

	useEffect(() => {
		const updateSize = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.offsetWidth;
				setSize(Math.min(containerWidth, maxSize));
			}
		};

		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, [maxSize]);

	return { size, containerRef };
}
