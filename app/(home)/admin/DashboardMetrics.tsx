'use client';

import Spinner from '@/app/_components/Spinner';
import { fetchMetrics } from '@/app/_services';
import type { Metrics } from '@/app/_services/types';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const DashboardMetrics = () => {
	const [metrics, setMetrics] = useState<Metrics | null>(null);

	const fetchLatestMetrics = async () => {
		try {
			const { metrics } = await fetchMetrics();
			console.log(metrics);
			setMetrics(metrics);
		} catch (err) {
			toast.error('Error fetching metrics');
		}
	};

	useEffect(() => {
		fetchLatestMetrics();
	}, []);

	return metrics ? (
		<>
			<div className="flex gap-5 flex-wrap">
				<div className="shadow bg-white border border-gray-200 p-6 rounded-lg w-52">
					<h5 className="text-5xl font-extrabold mb-2">
						{metrics.studentCount}
					</h5>
					<p className="">
						Student{metrics.studentCount !== 1 && 's'}
					</p>
				</div>
				<div className="shadow bg-white border border-gray-200 p-6 rounded-lg w-52">
					<h5 className="text-5xl font-extrabold mb-2">
						{metrics.lecturerCount}
					</h5>
					<p className="">
						Lecturer{metrics.lecturerCount !== 1 && 's'}
					</p>
				</div>
				<div className="shadow bg-white border border-gray-200 p-6 rounded-lg w-52">
					<h5 className="text-5xl font-extrabold mb-2">
						{metrics.moduleCount}
					</h5>
					<p className="">Module{metrics.moduleCount !== 1 && 's'}</p>
				</div>
				<div className="shadow bg-white border border-gray-200 p-6 rounded-lg w-52">
					<h5 className="text-5xl font-extrabold mb-2">
						{metrics.videoCount}
					</h5>
					<p className="">
						Lecture video{metrics.videoCount !== 1 && 's'}
					</p>
				</div>
			</div>
			<Toaster
				toastOptions={{
					className: 'font-sans',
					position: 'bottom-center',
				}}
			/>
		</>
	) : (
		<Spinner />
	);
};

export default DashboardMetrics;
