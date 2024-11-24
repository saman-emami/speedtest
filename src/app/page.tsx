import SpeedTest from "@/components/SpeedTest";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			<div className="w-full">
				<div className="flex flex-col items-center">
					<SpeedTest />
					<ThemeToggle />
				</div>
			</div>
		</main>
	);
}
