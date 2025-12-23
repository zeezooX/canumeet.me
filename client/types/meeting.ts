export interface GetIds {
  publicId: string;
  privateId: string;
}

export interface GetComment {
  commentId: number;
  meetingId: string;
  parentId?: number;
  owner: string;
  message: string;
  isAdmin: boolean;
  isUpdate: boolean;
  createdAt: string;
}

export interface GetMeeting {
  publicId: string;
  name?: string;
  owner: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  date?: Date;
  durationMins?: number;
  availabilityEnabled: boolean;
  availabilityDeadline?: Date;
  commentsEnabled: boolean;
  updatesEnabled: boolean;
  excusesEnabled: boolean;
  availabilityStart?: Date;
  availabilityEnd?: Date;
  userId?: number;
  comments?: GetComment[];
}

export interface CreateMeeting {
  availabilityEnabled?: boolean;
  availabilityDeadline?: string;
  commentsEnabled?: boolean;
  updatesEnabled?: boolean;
  excusesEnabled?: boolean;
  name?: string;
  description?: string;
  owner: string;
  date?: string;
  durationMins?: number;
  availabilityStart?: string;
  availabilityEnd?: string;
}

export interface UpdateMeeting {
  availabilityEnabled?: boolean;
  availabilityDeadline?: string;
  commentsEnabled?: boolean;
  updatesEnabled?: boolean;
  excusesEnabled?: boolean;
  name?: string;
  description?: string;
  owner?: string;
  date?: string;
  durationMins?: number;
  availabilityStart?: string;
  availabilityEnd?: string;
}
