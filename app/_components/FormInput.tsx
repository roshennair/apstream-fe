import { HTMLInputTypeAttribute } from 'react';
import {
	FieldError,
	FieldValues,
	Path,
	UseFormRegister,
} from 'react-hook-form';

const FormInput = <FormValues extends FieldValues>({
	label,
	name,
	type,
	required,
	register,
	error,
	placeholder,
}: {
	label: string;
	name: Path<FormValues>;
	register: UseFormRegister<FormValues>;
	type?: HTMLInputTypeAttribute;
	required?: boolean;
	error?: FieldError;
	placeholder?: string;
}) => {
	const errorMessage = error?.message;

	return (
		<>
			<div className="flex flex-col">
				<label htmlFor={`${name}-input`}>
					{label}
					{required ? <span className="text-red-600">*</span> : ''}
				</label>
				<input
					{...register(name, { required })}
					className="border-2 px-2 py-1 rounded-md"
					id={`${name}-input`}
					name={name}
					type={type}
					placeholder={placeholder}
					required={required}
				/>
			</div>
			{errorMessage && (
				<p className="mt-1 text-red-600">{errorMessage}</p>
			)}
		</>
	);
};

export default FormInput;
