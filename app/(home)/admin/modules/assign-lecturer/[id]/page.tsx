import { Metadata } from 'next';
import AssignLecturerForm from './AssignLecturerForm';

const AssignLecturerPage = ({ params: { id } }: { params: { id: string } }) => {
	return <AssignLecturerForm id={id} />;
};

export default AssignLecturerPage;

export const metadata: Metadata = {
	title: 'Assign Lecturer to Module | APStream',
};
