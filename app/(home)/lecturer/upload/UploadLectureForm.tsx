'use client';

import Button from '@/app/_components/Button';
import FormInput from '@/app/_components/FormInput';
import FormSelect from '@/app/_components/FormSelect';
import { fetchAssignedModules } from '@/app/_services/module';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { z } from 'zod';

type UploadLectureParams = {
	moduleId: string;
	title: string;
	description: string;
	videoFile: File;
	tags: string[];
};

const uploadLectureFormSchema = z.object({
	moduleId: z.string(),
	title: z.string(),
	description: z.string(),
	videoFile: z.instanceof(File),
	tags: z.array(z.string()),
});

const UploadLectureForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<UploadLectureParams>({
		resolver: zodResolver(uploadLectureFormSchema),
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [moduleIdsOptionsMap, setModuleIdsOptionsMap] = useState<Map<
		string,
		string
	> | null>(null);

	const fetchModules = async () => {
		try {
			const { modules } = await fetchAssignedModules();
			setModules(modules);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching modules');
			}
		}
	};

	const handleUploadLecture = async (data: UploadLectureParams) => {
		setIsUploading(true);
		console.log(data);
		toast.success('Lecture uploaded');
		setIsUploading(false);
	};

	return (
		<div className="max-w-md">
			<form
				className="flex flex-col gap-3"
				onSubmit={handleSubmit(handleUploadLecture)}
			>
				<FormSelect
					register={register}
					name="moduleId"
					label="Module"
					required
					optionValueMap={{}}
					error={errors.moduleId}
				/>
				<FormInput
					register={register}
					name="title"
					label="Lecture title"
					required
					error={errors.title}
				/>
				<div className="flex justify-end">
					<Button disabled={isUploading || !isValid} type="submit">
						{isUploading ? 'Uploading...' : 'Upload'}
					</Button>
				</div>
				<Toaster
					toastOptions={{
						className: 'font-sans',
						position: 'bottom-center',
					}}
				/>
			</form>
		</div>
	);
};

export default UploadLectureForm;
