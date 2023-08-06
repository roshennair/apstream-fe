import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const SideBarLink = ({
	children,
	link,
}: {
	children: ReactNode;
	link: string;
}) => {
	const pathname = usePathname();

	const isActive = pathname === link;

	return (
		<Link href={link}>
			<div
				className={`my-2 border-2 border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg p-2 transition-colors ${
					isActive ? 'bg-blue-600 text-white' : 'bg-white'
				}`}
			>
				{children}
			</div>
		</Link>
	);
};

export default SideBarLink;
