'use client';

import Button from '@/app/_components/Button';
import FormInput from '@/app/_components/FormInput';
import Spinner from '@/app/_components/Spinner';
import VideoPlayer from '@/app/_components/VideoPlayer';
import { isFailureResponse } from '@/app/_services';
import { createComment, deleteComment } from '@/app/_services/comment';
import type {
	Comment,
	CreateCommentParams,
} from '@/app/_services/comment/types';
import {
	fetchCommentsByLectureId,
	fetchLecture,
} from '@/app/_services/lecture';
import type { Lecture } from '@/app/_services/lecture/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { BsArrowReturnRight } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';
import { GoReply } from 'react-icons/go';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { z } from 'zod';

const createCommentSchema = z.object({
	content: z.string().nonempty(),
});

const SingleComment = ({
	comment,
	canReply = false,
	handleReply,
	handleDelete,
}: {
	comment: Comment;
	canReply?: boolean;
	// eslint-disable-next-line no-unused-vars
	handleReply?: (parentId: string, content: string) => Promise<void>;
	// eslint-disable-next-line no-unused-vars
	handleDelete: (id: string) => Promise<void>;
}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<CreateCommentParams>({
		resolver: zodResolver(createCommentSchema),
	});
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleReplyComment: SubmitHandler<CreateCommentParams> = async (
		data
	) => {
		if (!canReply || !handleReply) return;
		setIsLoading(true);
		await handleReply(comment.id, data.content);
		setIsLoading(false);
		reset();
		setShowReplyInput(false);
	};

	return (
		<div>
			<div className="flex items-center gap-4 my-2">
				{comment.parentId && (
					<BsArrowReturnRight className="text-blue-600 text-xl" />
				)}
				<div className="border w-full p-4 rounded-lg shadow flex items-center justify-between">
					<div className="flex flex-col">
						<span className="font-semibold">
							{comment.userName}{' '}
							<span
								className={`text-white text-sm font-normal px-1 rounded-full ml-1 ${
									comment.parentId
										? 'bg-green-600'
										: 'bg-yellow-500'
								}`}
							>
								{comment.parentId ? 'lecturer' : 'student'}
							</span>
						</span>
						<p>{comment.content}</p>
					</div>
					<div className="basis-6 ml-2 flex gap-1">
						{canReply && !showReplyInput && (
							<div
								className="rounded-full p-2 hover:bg-gray-200 cursor-pointer"
								onClick={() => setShowReplyInput(true)}
								title="Reply"
							>
								<GoReply className="text-blue-600 text-xl" />
							</div>
						)}
						<div
							className="rounded-full p-2 hover:bg-gray-200 cursor-pointer"
							title="Delete"
							onClick={() => handleDelete(comment.id)}
						>
							<FaTrash className="text-red-600 text-xl" />
						</div>
					</div>
				</div>
			</div>
			{showReplyInput && (
				<>
					<form
						className="mt-3 flex flex-col gap-1"
						onSubmit={handleSubmit(handleReplyComment)}
					>
						<FormInput
							register={register}
							label="Enter your reply"
							name="content"
							required
							error={errors.content}
						/>
						<div className="flex gap-1 justify-end">
							<Button
								disabled={isLoading || !isValid}
								type="submit"
							>
								{isLoading ? 'Sending...' : 'Reply'}
							</Button>
							<Button
								color="red"
								onClick={() => setShowReplyInput(false)}
							>
								Cancel
							</Button>
						</div>
					</form>
				</>
			)}
		</div>
	);
};

const LecturePlayer = ({ lectureId }: { lectureId: string }) => {
	const [lecture, setLecture] = useState<Lecture | null>(null);
	const [comments, setComments] = useState<Comment[] | null>(null);
	const playerRef = useRef<Player | null>(null);

	const organizeComments = (comments: Comment[]) => {
		const nestedComments: Comment[] = [];
		const topLevelComments: Comment[] = [];

		comments.forEach((comment) => {
			if (comment.parentId) {
				nestedComments.push(comment);
			} else {
				topLevelComments.push(comment);
			}
		});

		const result: {
			comment: Comment;
			replyComment?: Comment;
		}[] = [];

		topLevelComments.forEach((comment) => {
			const replyComment = nestedComments.find(
				(nestedComment) => nestedComment.parentId === comment.id
			);
			result.push({ comment, replyComment });
		});

		result.sort((a, b) => {
			return (
				new Date(a.comment.createdAt).getTime() -
				new Date(b.comment.createdAt).getTime()
			);
		});

		return result;
	};

	const organizedComments = useMemo(
		() => (comments ? organizeComments(comments) : []),
		[comments]
	);

	const fetchCurrentLecture = async () => {
		try {
			const { lecture } = await fetchLecture(lectureId);
			setLecture(lecture);
			document.title = `${lecture.title} | APStream`;
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching modules');
			}
		}
	};

	const fetchComments = async () => {
		try {
			const { comments } = await fetchCommentsByLectureId(lectureId);
			setComments(comments);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching comments');
			}
		}
	};

	useEffect(() => {
		fetchCurrentLecture();
		fetchComments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handlePlayerReady = (player: Player) => {
		playerRef.current = player;
		player.on('waiting', () => {
			videojs.log('Player is waiting');
		});
		player.on('dispose', () => {
			videojs.log('Player will be disposed');
		});
	};

	if (!lecture) {
		return <Spinner></Spinner>;
	}

	const handleDeleteComment = async (id: string) => {
		try {
			await deleteComment(id);
			fetchComments();
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error deleting comment');
			}
		}
	};

	const handleReply = async (parentId: string, content: string) => {
		try {
			await createComment({
				content,
				parentId,
				lectureId,
			});
			fetchComments();
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error replying to comment');
			}
		}
	};

	return (
		<>
			<div>
				<VideoPlayer
					options={{
						autoplay: false,
						controls: true,
						responsive: true,
						fluid: true,
						sources: [
							{
								src: `https://vz-9af7cb32-c20.b-cdn.net/${lecture.videoId}/playlist.m3u8`,
								type: 'application/x-mpegURL',
							},
						],
						playbackRates: [0.5, 1, 1.5, 2],
					}}
					onReady={handlePlayerReady}
				/>
				<div className="mt-5">
					<h1 className="text-3xl font-bold">{lecture.title}</h1>
					<div className="text-gray-500 mt-1">
						{`Uploaded on ${new Date(
							lecture.createdAt
						).toLocaleDateString('en-uk')} ${
							lecture.tags.length > 0 ? '•' : ''
						}`}
						{lecture.tags.map((tag, i) => (
							<span
								className="text-white text-sm py-1 px-2 rounded-full ml-1 bg-blue-600 lowercase"
								key={i}
							>
								{tag}
							</span>
						))}
					</div>
					<p className="mt-3">{lecture.description}</p>
				</div>
				<div className="mt-5">
					<h3 className="text-lg font-bold">Comments</h3>
					<div className="mt-3">
						{!comments
							? 'Loading...'
							: comments.length === 0
							? 'No comments yet'
							: organizedComments.map(
									({ comment, replyComment }) => (
										<div key={comment.id} className="mb-6">
											<SingleComment
												comment={comment}
												canReply={!replyComment}
												handleReply={handleReply}
												handleDelete={
													handleDeleteComment
												}
											/>
											{replyComment && (
												<SingleComment
													comment={replyComment}
													handleDelete={
														handleDeleteComment
													}
												/>
											)}
										</div>
									)
							  )}
					</div>
				</div>
			</div>
			<Toaster
				toastOptions={{
					className: 'font-sans',
					position: 'bottom-center',
				}}
			/>
		</>
	);
};

export default LecturePlayer;
