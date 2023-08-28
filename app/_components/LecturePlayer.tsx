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
	fetchBookmarksByLectureId,
	fetchCommentsByLectureId,
	fetchLecture,
	fetchNoteByLectureId,
} from '@/app/_services/lecture';
import type { Lecture } from '@/app/_services/lecture/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { BiTimeFive } from 'react-icons/bi';
import { BsArrowReturnRight } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';
import { GoReply } from 'react-icons/go';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { z } from 'zod';
import { createBookmark, deleteBookmark } from '../_services/bookmark';
import type { Bookmark } from '../_services/bookmark/types';
import { setNote } from '../_services/note';
import NotePad from './NotePad';

const ExpandableDescription = ({ description }: { description: string }) => {
	const [expand, setExpand] = useState(false);

	return (
		<div className="flex flex-col items-end">
			<div className="w-full">
				<p className={`mt-3 ${!expand && 'line-clamp-1'}`}>
					{description}
				</p>
			</div>
			<span
				className="text-blue-600 cursor-pointer font-semibold"
				onClick={() => {
					setExpand(!expand);
				}}
			>
				{expand ? 'Show less' : 'Show more'}
			</span>
		</div>
	);
};

type NewBookmarkFormFields = {
	timestamp: string;
	label: string;
};

const newBookmarkSchema = z.object({
	timestamp: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, {
		message: 'Timestamp must be in the format hh:mm:ss',
	}),
	label: z.string().nonempty({ message: 'Label cannot be empty' }),
});

const convertSecondsToTimestamp = (totalSeconds: number) => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
	const seconds = Math.floor(totalSeconds - hours * 3600 - minutes * 60);
	// pad with 0 if necessary
	const hoursStr = hours.toString().padStart(2, '0');
	const minutesStr = minutes.toString().padStart(2, '0');
	const secondsStr = seconds.toString().padStart(2, '0');
	return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

const SingleBookmark = ({
	bookmark,
	handleClick,
	handleDelete,
}: {
	bookmark: Bookmark;
	handleClick: () => void;
	// eslint-disable-next-line no-unused-vars
	handleDelete: (id: string) => Promise<void>;
}) => {
	return (
		<div className="flex gap-2 items-center">
			<div
				className="border-2 w-full border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg py-2 px-3 transition-colors cursor-pointer text-lg gap-3 flex items-center"
				onClick={handleClick}
			>
				<BiTimeFive />
				<span>
					{convertSecondsToTimestamp(bookmark.timestampSeconds)}
				</span>
				<span className="font-bold">{bookmark.label}</span>
			</div>
			<div
				className="bg-white p-2 rounded-full hover:bg-gray-200 cursor-pointer"
				title="Delete"
				onClick={() => handleDelete(bookmark.id)}
			>
				<FaTrash className="text-red-600 text-xl" />
			</div>
		</div>
	);
};

const BookmarkSection = ({
	lectureId,
	getPlayerTime,
	setPlayerTime,
}: {
	lectureId: string;
	getPlayerTime: () => number;
	// eslint-disable-next-line no-unused-vars
	setPlayerTime: (time: number) => void;
}) => {
	const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null);
	const [bookmarksLoading, setBookmarksLoading] = useState(false);
	const [showBookmarks, setShowBookmarks] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		trigger,
		reset: resetNewBookmark,
		formState: { errors, isValid },
	} = useForm<NewBookmarkFormFields>({
		resolver: zodResolver(newBookmarkSchema),
		defaultValues: {
			label: 'New bookmark',
		},
	});

	const fetchBookmarks = async () => {
		try {
			const { bookmarks } = await fetchBookmarksByLectureId(lectureId);
			setBookmarks(bookmarks);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching bookmarks');
			}
		}
	};

	useEffect(() => {
		fetchBookmarks();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// convert hh:mm:ss to seconds
	const convertTimestampToSeconds = (timestamp: string) => {
		const [hours, minutes, seconds] = timestamp.split(':');
		return (
			parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
		);
	};

	const handleCreateBookmark: SubmitHandler<NewBookmarkFormFields> = async (
		data
	) => {
		try {
			setBookmarksLoading(true);
			await createBookmark({
				label: data.label,
				timestampSeconds: convertTimestampToSeconds(data.timestamp),
				lectureId,
			});
			setBookmarksLoading(false);
			resetNewBookmark();
			fetchBookmarks();
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error creating bookmark');
			}
		}
	};

	const handleDeleteBookmark = async (id: string) => {
		try {
			await deleteBookmark(id);
			fetchBookmarks();
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error deleting bookmark');
			}
		}
	};

	return (
		<>
			<div className="flex gap-2 items-center">
				<h3 className="text-xl font-bold">Bookmarks</h3>
				<span
					className="text-blue-600 cursor-pointer font-semibold"
					onClick={() => setShowBookmarks(!showBookmarks)}
				>
					{showBookmarks ? 'Hide' : 'Show'}
				</span>
			</div>
			{showBookmarks && (
				<>
					<form
						className="mt-1 flex flex-col gap-3"
						onSubmit={handleSubmit(handleCreateBookmark)}
					>
						<div className="flex items-end gap-2">
							<div className="w-full">
								<FormInput
									register={register}
									name="timestamp"
									label="Timestamp"
									required
									error={errors.timestamp}
								/>
							</div>
							<Button
								onClick={() => {
									setValue(
										'timestamp',
										convertSecondsToTimestamp(
											getPlayerTime()
										)
									);
									trigger('timestamp');
								}}
							>
								Now
							</Button>
						</div>
						<FormInput
							register={register}
							name="label"
							label="Label"
							required
							error={errors.label}
						/>
						<div className="flex justify-end">
							<Button
								disabled={bookmarksLoading || !isValid}
								type="submit"
							>
								{bookmarksLoading ? 'Saving...' : 'Save'}
							</Button>
						</div>
					</form>
					<div className="mt-3">
						<h4 className="text-lg mb-2">Existing bookmarks</h4>
						<div className="flex flex-col gap-4">
							{!bookmarks
								? 'Loading bookmarks...'
								: bookmarks.length === 0
								? 'No bookmarks yet.'
								: bookmarks.map((bookmark) => (
										<SingleBookmark
											key={bookmark.id}
											bookmark={bookmark}
											handleClick={() => {
												setPlayerTime(
													bookmark.timestampSeconds
												);
												setShowBookmarks(false);
											}}
											handleDelete={handleDeleteBookmark}
										/>
								  ))}
						</div>
					</div>
				</>
			)}
		</>
	);
};

const createCommentSchema = z.object({
	content: z.string().nonempty(),
});

const SingleComment = ({
	comment,
	isLecturer,
	canReply = false,
	handleReply,
	handleDelete,
}: {
	comment: Comment;
	isLecturer?: boolean;
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
					{isLecturer && (
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
					)}
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

const CommentSection = ({
	lectureId,
	userType,
}: {
	lectureId: string;
	userType: 'lecturer' | 'student';
}) => {
	const [comments, setComments] = useState<Comment[] | null>(null);
	const [commentsLoading, setCommentsLoading] = useState(false);
	const [showComments, setShowComments] = useState(true);

	const {
		register,
		handleSubmit,
		reset: resetNewComment,
		formState: { errors, isValid },
	} = useForm<CreateCommentParams>({
		resolver: zodResolver(createCommentSchema),
	});

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

		// sort the comments by date such that the latest comment is at the top
		result.sort((a, b) => {
			const aDate = new Date(a.comment.createdAt);
			const bDate = new Date(b.comment.createdAt);
			return bDate.getTime() - aDate.getTime();
		});

		return result;
	};

	const organizedComments = useMemo(
		() => (comments ? organizeComments(comments) : []),
		[comments]
	);

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
		fetchComments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleComment: SubmitHandler<CreateCommentParams> = async (data) => {
		try {
			setCommentsLoading(true);
			await createComment({
				content: data.content,
				lectureId,
				parentId: null,
			});
			setCommentsLoading(false);
			resetNewComment();
			fetchComments();
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error creating comment');
			}
		}
	};

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
			<div className="flex gap-2 items-center">
				<h3 className="text-xl font-bold">Comments</h3>
				<span
					className="text-blue-600 cursor-pointer font-semibold"
					onClick={() => setShowComments(!showComments)}
				>
					{showComments ? 'Hide' : 'Show'}
				</span>
			</div>
			{showComments && (
				<>
					{userType === 'student' && (
						<form
							className="mt-1 flex flex-col gap-1"
							onSubmit={handleSubmit(handleComment)}
						>
							<FormInput
								register={register}
								label="Enter new comment"
								name="content"
								required
								error={errors.content}
							/>
							<div className="flex gap-1 justify-end">
								<Button
									disabled={commentsLoading || !isValid}
									type="submit"
								>
									{commentsLoading ? 'Sending...' : 'Send'}
								</Button>
							</div>
						</form>
					)}
					<div className="mt-3">
						{!comments
							? 'Loading...'
							: comments.length === 0
							? 'No comments yet.'
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
												isLecturer={
													userType === 'lecturer'
												}
											/>
											{replyComment && (
												<SingleComment
													comment={replyComment}
													handleDelete={
														handleDeleteComment
													}
													isLecturer={
														userType === 'lecturer'
													}
												/>
											)}
										</div>
									)
							  )}
					</div>
				</>
			)}
		</>
	);
};

const NotesButton = ({ lectureId }: { lectureId: string }) => {
	const [showNotePad, setShowNotePad] = useState(false);
	const [saveStatus, setSaveStatus] = useState<
		'saved' | 'saving' | 'unsaved'
	>('unsaved');
	const [noteContent, setNoteContent] = useState<string | null>(null);

	const fetchNote = async () => {
		try {
			const { note } = await fetchNoteByLectureId(lectureId);
			setNoteContent(note ? note.content : null);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching notes');
			}
		}
	};

	const saveNote = async () => {
		try {
			setSaveStatus('saving');
			await setNote({
				content: noteContent || '',
				lectureId,
			});
			setSaveStatus('saved');
			toast.success('Notes saved');
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error saving notes');
			}
		}
	};

	useEffect(() => {
		fetchNote();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (showNotePad) {
		document.documentElement.style.overflow = 'hidden';
	} else {
		document.documentElement.style.overflow = 'auto';
	}

	return (
		<div>
			<Button onClick={() => setShowNotePad(true)}>Notes</Button>
			{showNotePad && (
				<div
					className="z-20 fixed inset-0 w-screen bg-black/50 cursor-pointer"
					onClick={() => setShowNotePad(false)}
				>
					<div
						className="absolute top-0 right-0 bg-white w-full h-screen max-w-2xl p-4 cursor-default"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex justify-between mb-3 items-center">
							<h3 className="text-xl font-bold">Notes</h3>
							<div>
								<Button
									onClick={saveNote}
									className="mr-2"
									disabled={saveStatus !== 'unsaved'}
								>
									{saveStatus === 'saving'
										? 'Saving...'
										: saveStatus === 'saved'
										? 'Saved'
										: 'Save'}
								</Button>
								<Button
									onClick={() => setShowNotePad(false)}
									color="red"
								>
									Close
								</Button>
							</div>
						</div>
						<NotePad
							content={noteContent}
							setContent={(content: string) => {
								setNoteContent(content);
								setSaveStatus('unsaved');
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

const LecturePlayer = ({
	lectureId,
	userType,
}: {
	lectureId: string;
	userType: 'lecturer' | 'student';
}) => {
	const [lecture, setLecture] = useState<Lecture | null>(null);
	const playerRef = useRef<Player | null>(null);

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

	useEffect(() => {
		fetchCurrentLecture();
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

	return (
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
			<div className="mt-3">
				<div className="flex items-start justify-between">
					<h1 className="text-3xl font-bold">{lecture.title}</h1>
					{userType === 'student' && (
						<div className="flex gap-2">
							<NotesButton lectureId={lectureId} />
						</div>
					)}
				</div>
				<div className="text-gray-500 mt-2">
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
				<ExpandableDescription description={lecture.description} />
			</div>
			<hr className="mt-3" />
			{userType === 'student' && (
				<div className="mt-5">
					<BookmarkSection
						lectureId={lectureId}
						getPlayerTime={() =>
							playerRef.current?.currentTime() as number
						}
						setPlayerTime={(time) => {
							playerRef.current?.currentTime(time);
							window.scrollTo(0, 0);
							playerRef.current?.play();
						}}
					/>
					<hr className="mt-5" />
				</div>
			)}
			<div className="mt-5">
				<CommentSection lectureId={lectureId} userType={userType} />
			</div>
			<Toaster
				toastOptions={{
					className: 'font-sans',
					position: 'bottom-center',
				}}
			/>
		</div>
	);
};

export default LecturePlayer;
