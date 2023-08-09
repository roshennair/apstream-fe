import { ReactNode } from 'react';

const Button = ({
	children,
	onClick,
	disabled,
	className,
	type = 'button',
	color = 'blue',
}: {
	children: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	type?: 'button' | 'submit';
	color?: string;
}) => {
	return (
		<button
			className={`bg-${color}-600 text-white rounded-lg py-1 px-3 disabled:bg-gray-600 disabled:cursor-not-allowed ${className}`}
			onClick={onClick}
			disabled={disabled}
			type={type}
		>
			{children}
		</button>
	);
};

export default Button;
