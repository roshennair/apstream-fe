'use client';

import Button from '@/app/_components/Button';
import FormFileInput from '@/app/_components/FormFileInput';
import FormInput from '@/app/_components/FormInput';
import FormSelect from '@/app/_components/FormSelect';
import FormTagInput from '@/app/_components/FormTagInput';
import Spinner from '@/app/_components/Spinner';
import { isFailureResponse } from '@/app/_services';
import { createLecture, uploadLecture } from '@/app/_services/lecture';
import { fetchAssignedModules } from '@/app/_services/module';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { z } from 'zod';

type UploadLectureFields = {
	moduleId: string;
	title: string;
	description: string;
	tags: string;
	videoFile: File;
};

const uploadLectureFormSchema = z.object({
	moduleId: z.string(),
	title: z.string().min(1, 'Title cannot be empty'),
	description: z.string().min(1, 'Description cannot be empty'),
	tags: z.string().min(1, 'At least one tag is required'),
	videoFile: z.any().refine((file) => file instanceof File, {
		message: 'A video file is required',
	}),
});

const UploadLectureForm = () => {
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		setError,
		clearErrors,
		trigger,
		reset,
		formState: { errors, isValid },
	} = useForm<UploadLectureFields>({
		resolver: zodResolver(uploadLectureFormSchema),
		mode: 'onChange',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [moduleIdsMap, setModuleIdsMap] = useState<Map<
		string,
		string
	> | null>(null);
	const [videoDurationSeconds, setVideoDurationSeconds] = useState<
		number | null
	>(null);
	const [uploadStatus, setUploadStatus] = useState<
		'' | 'creating' | 'uploading' | 'done'
	>('');

	const fetchModules = async () => {
		try {
			setIsLoading(true);
			const { modules } = await fetchAssignedModules();
			setModuleIdsMap(
				new Map(modules.map((module) => [module.name, module.id]))
			);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching modules');
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchModules();
	}, []);

	const getTags = () => {
		const tags = getValues('tags');
		return tags ? tags.split(',') : [];
	};

	const updateTags = (tags: string[]) => {
		setValue('tags', tags.join(','));
		trigger('tags');
	};

	const getVideoFile = () => {
		return getValues('videoFile');
	};

	const updateVideoFile = (videoFile: File) => {
		if (!videoFile.type.startsWith('video/')) {
			setError('videoFile', {
				type: 'manual',
				message: 'File must be a video',
			});
			setVideoDurationSeconds(null);
		} else {
			clearErrors('videoFile');
		}

		setValue('videoFile', videoFile);

		// Get video duration
		const video = document.createElement('video');
		video.src = URL.createObjectURL(videoFile);
		video.ondurationchange = () => {
			setVideoDurationSeconds(video.duration);
			URL.revokeObjectURL(video.src);
			video.remove();
		};

		trigger();
	};

	const handleUploadLecture = async (data: UploadLectureFields) => {
		setUploadStatus('creating');
		const { videoId } = await createLecture({
			...data,
			durationSeconds: videoDurationSeconds as number,
		});
		setUploadStatus('uploading');
		await uploadLecture({
			videoId,
			videoFile: data.videoFile,
		});
		setUploadStatus('done');
	};

	const handleReset = () => {
		reset();
		setUploadStatus('');
		setVideoDurationSeconds(null);
	};

	if (isLoading || !moduleIdsMap) {
		return <Spinner />;
	}

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
					optionValueMap={moduleIdsMap}
					error={errors.moduleId}
				/>
				<FormInput
					register={register}
					name="title"
					label="Title"
					required
					error={errors.title}
				/>
				<FormInput
					register={register}
					name="description"
					label="Description"
					required
					type="multiline"
					error={errors.description}
				/>
				<FormTagInput
					register={register}
					getTags={getTags}
					updateTags={updateTags}
					name="tags"
					label="Tags"
					required
					error={errors.tags}
				/>
				<FormFileInput
					register={register}
					getFile={getVideoFile}
					updateFile={updateVideoFile}
					name="videoFile"
					label="Video file"
					required
					error={errors.videoFile}
				/>
				<div className="flex justify-end">
					<Button disabled={!isValid} type="submit">
						{uploadStatus === ''
							? 'Upload'
							: uploadStatus === 'done'
							? 'Done'
							: 'Uploading'}
					</Button>
				</div>
			</form>
			{uploadStatus && uploadStatus !== 'done' && (
				<div>
					<span className="font-bold">Upload status: </span>
					<span>
						{uploadStatus === 'creating'
							? 'Creating lecture...'
							: 'Uploading video...'}
					</span>
				</div>
			)}
			<Toaster
				toastOptions={{
					className: 'font-sans',
					position: 'bottom-center',
				}}
			/>
			{uploadStatus === 'done' && (
				<div
					className="fixed inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/60 p-4"
					onClick={handleReset}
				>
					<div
						className="bg-white rounded-lg shadow w-full max-w-lg cursor-default p-6 flex flex-col justify-center items-center"
						onClick={(e) => e.stopPropagation()}
					>
						<BsFillCheckCircleFill className="text-green-500 text-4xl" />
						<h4 className="mt-4 font-bold text-2xl">
							Upload Complete!
						</h4>
						<p className="mt-2 text-center">
							Your new lecture titled{' '}
							<span className="font-bold">
								{getValues('title')}
							</span>{' '}
							has been uploaded successfully!
						</p>
						<Button className="mt-4" onClick={handleReset}>
							Continue
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default UploadLectureForm;
