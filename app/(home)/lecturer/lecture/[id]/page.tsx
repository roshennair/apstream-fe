import { Metadata } from 'next';
import LecturePlayer from './LecturePlayer';

const WatchLecturePage = ({ params: { id } }: { params: { id: string } }) => {
	return (
		<>
			<LecturePlayer lectureId={id} />
		</>
	);
};

export default WatchLecturePage;

export const metadata: Metadata = { title: 'Watch Lecture | APStream' };
