export interface Poll {
    pollId: string;
    createdBy: string;
    name: string;
    isMulti: boolean;
    isPaused: boolean;
    isClosed: boolean;
    startDate: string;
    endDate: string;
    options: PollOption[];
}

export interface PollOption {
    optionId: string;
    optionName: string;
    votes: number;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data?: T;
    timestamp: string;
    error?: string;
}
