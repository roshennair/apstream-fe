'use client';

import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';
import { Lecture } from '../_services/lecture/types';

const LectureCard = ({
	lecture,
	userType,
}: {
	lecture: Lecture;
	userType: 'lecturer' | 'student';
}) => {
	return (
		<Link href={`/${userType}/lecture/${lecture.id}`}>
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

export default LectureCard;
