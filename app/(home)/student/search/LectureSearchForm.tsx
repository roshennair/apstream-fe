'use client';

import Button from '@/app/_components/Button';
import FormInput from '@/app/_components/FormInput';
import LectureCard from '@/app/_components/LectureCard';
import { isFailureResponse } from '@/app/_services';
import { Lecture } from '@/app/_services/lecture/types';
import { searchLectures } from '@/app/_services/search';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { z } from 'zod';

type LectureSearchParams = {
	query: string;
};

const lectureSearchSchema = z.object({
	query: z.string().min(1),
});

const LectureSearchForm = () => {
	const [isSearching, setIsSearching] = useState(false);
	const [lectures, setLectures] = useState<Lecture[] | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid },
	} = useForm<LectureSearchParams>({
		resolver: zodResolver(lectureSearchSchema),
	});

	const handleSearchLectures: SubmitHandler<LectureSearchParams> = async ({
		query,
	}) => {
		try {
			setIsSearching(true);
			const { lectures } = await searchLectures(query);
			setLectures(lectures);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error searching for lectures');
			}
		} finally {
			setIsSearching(false);
		}
	};

	return (
		<>
			<h1 className="text-3xl font-bold">Lecture Search</h1>
			<div className="mt-5">
				<form
					onSubmit={handleSubmit(handleSearchLectures)}
					className="flex flex-col max-w-md gap-2"
				>
					<FormInput
						register={register}
						name="query"
						label="Enter a keyword to search for matching lectures"
					/>
					<div className="flex justify-end gap-2">
						{lectures && isValid && (
							<Button
								color="red"
								onClick={() => {
									setLectures(null);
									reset();
								}}
								disabled={isSearching}
							>
								Clear
							</Button>
						)}
						<Button
							disabled={isSearching || !isValid}
							type="submit"
						>
							{isSearching ? 'Searching...' : 'Search'}
						</Button>
					</div>
				</form>
				<Toaster
					toastOptions={{
						className: 'font-sans',
						position: 'bottom-center',
					}}
				/>
			</div>
			<div>
				{lectures && (
					<>
						<h3 className="font-bold my-3 text-lg">
							Search Results
						</h3>
						{lectures.length > 0 ? (
							<div className="flex flex-col gap-3">
								{lectures.map((lecture, i) => (
									<LectureCard
										lecture={lecture}
										key={i}
										userType="student"
									/>
								))}
							</div>
						) : (
							<p>
								No matching lectures found in your assigned
								modules.
							</p>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default LectureSearchForm;
