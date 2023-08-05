import type { FailureResponse } from './types';

export const isFailureResponse = (
	response: any
): response is FailureResponse => {
	return 'error' in response && typeof response.error === 'string';
};
