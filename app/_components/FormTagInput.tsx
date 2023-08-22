import { useState } from 'react';
import {
	FieldError,
	FieldValues,
	Path,
	UseFormRegister,
} from 'react-hook-form';
import { IoIosClose } from 'react-icons/io';
import Button from './Button';

const FormTagInput = <FormValues extends FieldValues>({
	register,
	getTags,
	updateTags,
	label,
	name,
	required,
	error,
}: {
	register: UseFormRegister<FormValues>;
	getTags: () => string[];
	// eslint-disable-next-line no-unused-vars
	updateTags: (tags: string[]) => void;
	label: string;
	name: Path<FormValues>;
	required?: boolean;
	error?: FieldError;
}) => {
	const [newTag, setNewTag] = useState<string>('');

	const tags = getTags();
	const errorMessage = error?.message;

	const addTag = () => {
		if (!(newTag.length === 0 || tags.includes(newTag))) {
			updateTags([...tags, newTag]);
		}
		setNewTag('');
	};

	return (
		<div>
			<div className="flex flex-col">
				<input
					type="hidden"
					required={required}
					{...register(name, { required })}
					value={tags.join(',')}
				/>
				<label htmlFor={`${name}-input`}>
					{label}
					{required ? <span className="text-red-600">*</span> : ''}
				</label>
				<div className="flex">
					<input
						type="text"
						className="border-2 px-2 py-1 rounded-md w-full"
						id={`${name}-input`}
						name={name}
						value={newTag}
						onChange={(e) =>
							setNewTag(e.target.value.toLowerCase())
						}
						// on press of enter key, add tag
						onKeyDown={(e) => {
							if (e.key === 'Enter' && newTag.length > 0) {
								e.preventDefault();
								addTag();
							}
						}}
					/>
					<Button
						className="ml-2"
						disabled={newTag.length === 0}
						onClick={addTag}
					>
						Add
					</Button>
				</div>
				<div className="flex mt-2 flex-wrap gap-x-1 gap-y-2">
					{tags.map((currentTag, i) => (
						<div
							className="flex items-center text-white text-sm py-2 pl-3 pr-2 gap-1 rounded-full bg-blue-600"
							key={i}
						>
							{currentTag}
							<div className="rounded-full hover">
								<IoIosClose
									className="text-xl cursor-pointer"
									title="Delete"
									onClick={() => {
										updateTags(
											tags.filter(
												(tag) => tag !== currentTag
											)
										);
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
			{errorMessage && (
				<p className="mt-1 text-red-600">{errorMessage}</p>
			)}
		</div>
	);
};

export default FormTagInput;
