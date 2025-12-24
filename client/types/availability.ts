export interface GetRange {
  rangeId: number;
  availabilityId: string;
  startTime: string;
  endTime: string;
}

export interface CreateRange {
  startTime: string;
  endTime: string;
}

export interface CreateAvailability {
  owner: string;
  message?: string;
  ranges: CreateRange[];
}

export interface GetAvailability {
  meetingId: string;
  publicId: string;
  privateId: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  message?: string;
  userId?: number;
  ranges: GetRange[];
}
