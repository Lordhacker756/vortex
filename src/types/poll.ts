export interface PollOption {
    optionId: string;
    optionName: string;
    votes: number;
}

export interface Poll {
    pollId: string;
    name: string;
    createdBy: string;
    startDate: string;
    endDate: string;
    isMulti: boolean;
    isPaused: boolean;
    isClosed: boolean;
    options: PollOption[];
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data?: T;
}
