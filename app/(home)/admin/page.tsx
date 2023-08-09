import { Metadata } from 'next';
import DashboardMetrics from './DashboardMetrics';

const AdminDashboardPage = () => {
	return (
		<>
			<h1 className="text-3xl font-bold">Dashboard</h1>
			<div className="mt-5">
				<DashboardMetrics />
			</div>
		</>
	);
};

export default AdminDashboardPage;

export const metadata: Metadata = { title: 'Dashboard | APStream' };
