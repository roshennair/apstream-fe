import type { FailureResponse, GetMetricsResponse } from './types';

export const isFailureResponse = (
	response: any
): response is FailureResponse => {
	return 'error' in response && typeof response.error === 'string';
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchMetrics = async () => {
	const response = await fetch(`${API_URL}/metrics`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as GetMetricsResponse;
};
