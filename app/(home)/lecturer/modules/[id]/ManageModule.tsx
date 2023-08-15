'use client';

import Button from '@/app/_components/Button';
import { isFailureResponse } from '@/app/_services';
import type { Lecture } from '@/app/_services/lecture/types';
import { fetchModule, fetchModuleLectures } from '@/app/_services/module';
import { Module } from '@/app/_services/module/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import { FaPlay } from 'react-icons/fa';

const LectureCard = ({ lecture }: { lecture: Lecture }) => {
	return (
		<Link href={`/lecturer/lecture/${lecture.id}`}>
			<div className="px-6 py-4 border border-gray-200 rounded-lg shadow hover:bg-gray-100 flex items-center">
				<div>
					<FaPlay className="text-blue-600 mr-5" />
				</div>
				<div className="flex flex-col gap-1">
					<span className="font-bold text-lg">{lecture.title}</span>
					<span
						className="overflow-ellipsis line-clamp-1"
						title={lecture.description}
					>
						{lecture.description}
					</span>
					<div className="text-gray-500">
						{`Uploaded ${new Date(
							lecture.createdAt
						).toLocaleDateString('en-uk')} • ${Math.round(
							lecture.durationSeconds / 60
						)} minutes ${lecture.tags.length > 0 ? '•' : ''}`}
						{lecture.tags.map((tag, i) => (
							<span
								className="text-white text-sm py-1 px-2 rounded-full ml-1 bg-blue-600 lowercase"
								key={i}
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</Link>
	);
};

const ManageModule = ({ id }: { id: string }) => {
	const { push } = useRouter();
	const [module, setModule] = useState<Module | null>(null);
	const [lectures, setLectures] = useState<Lecture[] | null>(null);

	const fetchCurrentModule = async () => {
		try {
			const { module } = await fetchModule(id);
			if (!module) {
				push('/admin/modules');
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
					onClick={() => push('/lecturer/modules')}
				/>
				<h1 className="text-3xl font-bold pl-3">Manage Module</h1>
			</div>
			<div className="mt-5">
				<div>
					<span className="">Selected module:</span>{' '}
					{module ? `${module.name} (${module.code})` : 'Loading...'}
				</div>
				<div className="mt-5">
					<div className="flex justify-between items-end">
						<h3 className="text-lg font-bold">Module playlist</h3>
						<Link href="/lecturer/upload">
							<Button>Upload lecture</Button>
						</Link>
					</div>
					<div className="mt-4 flex flex-col gap-4">
						{!lectures ? (
							<div>Loading...</div>
						) : lectures.length === 0 ? (
							<div>No lectures found.</div>
						) : (
							lectures.map((lecture) => (
								<div key={lecture.id}>
									<LectureCard lecture={lecture} />
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ManageModule;
