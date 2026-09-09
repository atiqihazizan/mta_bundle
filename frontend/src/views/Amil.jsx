export default function Amil() {
	return (
		<div className="flex flex-col h-screen">
			<div className="flex justify-end gap-2 px-4 py-2 bg-white border-b">
				<a
					href="/amil/manual.html"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
				>
					📋 Manual
				</a>
			</div>
			<iframe
				src="/amil/"
				className="w-full flex-1 border-0"
				title="Borang Pugutan Fitrah"
			/>
		</div>
	);
}
