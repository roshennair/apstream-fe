import { Metadata } from 'next';
import LectureSearchForm from './LectureSearchForm';

const LectureSearchPage = () => {
	return <LectureSearchForm />;
};

export default LectureSearchPage;

export const metadata: Metadata = { title: 'Lecture Search | APStream' };
