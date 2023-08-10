import { Metadata } from 'next';
import AssignStudentForm from './AssignStudentForm';

const AssignStudentPage = ({ params: { id } }: { params: { id: string } }) => {
	return <AssignStudentForm id={id} />;
};

export default AssignStudentPage;

export const metadata: Metadata = {
	title: 'Assign Student to Module | APStream',
};
