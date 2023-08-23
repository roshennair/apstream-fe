import type { Metadata } from 'next';
import ViewLectures from './ViewLectures';

const ViewLecturesPage = ({
	params: { id: moduleId },
}: {
	params: { id: string };
}) => {
	return <ViewLectures id={moduleId} />;
};

export default ViewLecturesPage;

export const metadata: Metadata = { title: 'View Lectures | APStream' };
