import Spinner from './_components/Spinner';

export default function LoadingPage() {
	return (
		<div
			role="status"
			className="flex min-h-screen items-center justify-center"
		>
			<Spinner />
		</div>
	);
}
