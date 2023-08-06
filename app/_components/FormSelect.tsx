import {
	FieldError,
	FieldValues,
	Path,
	UseFormRegister,
} from 'react-hook-form';

const FormSelect = <FormValues extends FieldValues>({
	label,
	name,
	required,
	register,
	optionValueMap,
	error,
}: {
	label: string;
	name: Path<FormValues>;
	required?: boolean;
	register: UseFormRegister<FormValues>;
	optionValueMap: Map<string, any>;
	error?: FieldError;
}) => {
	const errorMessage = error?.message;

	return (
		<div className="flex flex-col">
			<label htmlFor={`${name}-input`}>
				{label}
				{required ? <span className="text-red-600">*</span> : ''}
			</label>
			<select
				{...register(name, { required })}
				className="border-2 px-1 py-2 rounded-md"
				id={`${name}-input`}
				name={name}
				required={required}
			>
				{[...optionValueMap.keys()].map((option) => {
					return (
						<option value={optionValueMap.get(option)} key={option}>
							{option}
						</option>
					);
				})}
			</select>
			{errorMessage && (
				<p className="mt-1 text-red-600">{errorMessage}</p>
			)}
		</div>
	);
};

export default FormSelect;
