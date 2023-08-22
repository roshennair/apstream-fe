import { ChangeEventHandler } from 'react';
import {
	FieldError,
	FieldValues,
	Path,
	UseFormRegister,
} from 'react-hook-form';
import Button from './Button';

const FormFileInput = <FormValues extends FieldValues>({
	register,
	getFile,
	updateFile,
	label,
	name,
	required,
	error,
}: {
	register: UseFormRegister<FormValues>;
	getFile: () => File;
	// eslint-disable-next-line no-unused-vars
	updateFile: (file: File) => void;
	label: string;
	name: Path<FormValues>;
	required?: boolean;
	error?: FieldError;
}) => {
	const file = getFile();
	const errorMessage = error?.message;

	const handleSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
		const { files } = e.target;
		if (files && files.length > 0) {
			updateFile(files[0]);
		}
	};

	return (
		<div>
			<div className="flex flex-col">
				<label htmlFor={`${name}-file-input`}>
					{label}
					{required ? <span className="text-red-600">*</span> : ''}
				</label>
				<input
					{...register(name, { required })}
					id={`${name}-file-input`}
					type="file"
					className="hidden"
					name={name}
					onChange={handleSelect}
					accept="video/*"
				/>
				<div className="flex gap-2">
					<div
						className="border-2 px-2 py-1 rounded-md w-full cursor-pointer line-clamp-1"
						title={file ? file.name : 'Select file'}
						onClick={() => {
							document
								.getElementById(`${name}-file-input`)
								?.click();
						}}
					>
						{file ? file.name : 'No file selected'}
					</div>
					<Button
						onClick={() => {
							document
								.getElementById(`${name}-file-input`)
								?.click();
						}}
					>
						Select
					</Button>
				</div>
			</div>
			{errorMessage && (
				<p className="mt-1 text-red-600">{errorMessage}</p>
			)}
		</div>
	);
};

export default FormFileInput;
