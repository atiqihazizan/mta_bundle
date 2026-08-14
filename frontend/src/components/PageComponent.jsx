import { Bars3Icon } from '@heroicons/react/24/outline'

function PageComponent({ title, buttons = "", children, mainClass, onSidebarOpen }) {
	return (
		<>
			<header className="bg-white shadow">
				{/* <div className="flex justify-between items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> */}
				<div className="flex justify-between items-center px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center gap-4">
						<button
							type="button"
							className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
							onClick={onSidebarOpen}
						>
							<span className="sr-only">Open sidebar</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">
							{title}
						</h1>
					</div>
					{buttons}
				</div>
			</header>
			<main>
				{/* <div className="mx-auto max-w-7xl">{children}</div> */}
				{/* <div className="py-6 sm:px-6 lg:px-8">{children}</div> */}
				<div className={mainClass}>{children}</div>
			</main>
		</>
	);
}

export default PageComponent;
