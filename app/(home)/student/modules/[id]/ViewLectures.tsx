'use client';

import LectureCard from '@/app/_components/LectureCard';
import { isFailureResponse } from '@/app/_services';
import type { Lecture } from '@/app/_services/lecture/types';
import { fetchModule, fetchModuleLectures } from '@/app/_services/module';
import { Module } from '@/app/_services/module/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';

const ViewLectures = ({ id }: { id: string }) => {
	const { push } = useRouter();
	const [module, setModule] = useState<Module | null>(null);
	const [lectures, setLectures] = useState<Lecture[] | null>(null);

	const fetchCurrentModule = async () => {
		try {
			const { module } = await fetchModule(id);
			if (!module) {
				push('/student/modules');
			}
			setModule(module);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching module');
			}
		}
	};

	const fetchLectures = async () => {
		try {
			const { lectures } = await fetchModuleLectures(id);
			setLectures(lectures);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching lectures');
			}
		}
	};

	useEffect(() => {
		fetchCurrentModule();
		fetchLectures();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="flex items-center">
				<BiArrowBack
					title="Back"
					className="text-2xl text-blue-600 cursor-pointer"
					onClick={() => push('/student/modules')}
				/>
				<h1 className="text-3xl font-bold pl-3">View Lectures</h1>
			</div>
			<div className="mt-5">
				<div>
					<span className="">Selected module:</span>{' '}
					{module ? `${module.name} (${module.code})` : 'Loading...'}
				</div>
				<div className="mt-5">
					<h3 className="text-lg font-bold">Module playlist</h3>
					<div className="mt-4 flex flex-col gap-4">
						{!lectures ? (
							<div>Loading...</div>
						) : lectures.length === 0 ? (
							<div>No lectures found.</div>
						) : (
							lectures.map((lecture) => (
								<div key={lecture.id}>
									<LectureCard
										lecture={lecture}
										userType="student"
									/>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ViewLectures;
