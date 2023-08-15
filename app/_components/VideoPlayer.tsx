import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

type VideoPlayerOptions = {
	autoplay?: boolean;
	controls?: boolean;
	responsive?: boolean;
	fluid?: boolean;
	sources: {
		src: string;
		type: string;
	}[];
	playbackRates?: number[];
};

const VideoPlayer = ({
	options,
	onReady,
}: {
	options: VideoPlayerOptions;
	// eslint-disable-next-line no-unused-vars
	onReady: (player: Player) => void;
}) => {
	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Player | null>(null);

	useEffect(() => {
		if (!playerRef.current) {
			const videoElement = document.createElement('video-js');
			videoElement.classList.add('vjs-big-play-centered');
			videoRef.current!.appendChild(videoElement);
			const player = (playerRef.current = videojs(
				videoElement,
				options,
				() => {
					videojs.log('Player is ready');
					onReady && onReady(player);
				}
			));
		} else {
			const player = playerRef.current;
			player.autoplay(options.autoplay);
			player.src(options.sources);
		}
	}, [options, videoRef, onReady]);

	useEffect(() => {
		const player = playerRef.current;

		return () => {
			if (player && !player.isDisposed()) {
				player.dispose();
				playerRef.current = null;
			}
		};
	}, [playerRef]);

	return (
		<div data-vjs-player>
			<div ref={videoRef} className="rounded-xl overflow-hidden" />
		</div>
	);
};

export default VideoPlayer;
