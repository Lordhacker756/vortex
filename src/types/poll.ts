export interface PollOption {
    optionId: string;
    optionName?: string;
    option_name?: string;  // For snake_case format from API
    votes: number;
}

export interface Poll {
    pollId: string;
    name: string;
    // Handle both camelCase and snake_case formats
    isMulti?: boolean;
    is_multi?: boolean;
    isPaused?: boolean;
    is_paused?: boolean;
    isClosed?: boolean;
    is_closed?: boolean;
    startDate?: string | Date;
    start_date?: string | Date;
    endDate?: string | Date;
    end_date?: string | Date;
    options: PollOption[];
    createdBy?: string;
    votedBy?: string[];
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data?: T;
}
