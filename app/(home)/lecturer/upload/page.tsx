import { Metadata } from 'next';
import UploadLectureForm from './UploadLectureForm';

const UploadLecturePage = () => {
	// lecture video fields:
	// title
	// description
	// video file
	// tags

	return (
		<>
			<h1 className="text-3xl font-bold mb-5">Upload Lecture</h1>
			<UploadLectureForm />
		</>
	);
};

export default UploadLecturePage;

export const metadata: Metadata = { title: 'Upload Lecture | APStream' };
