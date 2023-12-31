import LecturePlayer from '@/app/_components/LecturePlayer';
import { Metadata } from 'next';

const WatchLecturePage = ({ params: { id } }: { params: { id: string } }) => {
	return (
		<>
			<LecturePlayer lectureId={id} userType="lecturer" />
		</>
	);
};

export default WatchLecturePage;

export const metadata: Metadata = { title: 'Watch Lecture | APStream' };
