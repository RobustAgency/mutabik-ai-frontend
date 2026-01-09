export enum MeetingType {
  REGULAR = "regular",
  AD_HOC = "ad_hoc",
  EMERGENCY = "emergency",
}

export enum AttendancePolicy {
  QUORUM_REQUIRED = "quorum_required",
  NO_QUORUM_REQUIRED = "no_quorum_required",
}

export interface CommitteeMeeting {
  id: number;
  ai_committee_id: number;
  meeting_type: MeetingType;
  scheduled_at: string;
  duration_minutes: number | null;
  agenda: string;
  materials_link: string | null;
  attendance_policy: AttendancePolicy;
  attendance_roster: string[] | null;
  minutes_link: string | null;
  created_at: string;
  updated_at: string;
  committee?: {
    id: number;
    name: string;
  };
}

export interface CommitteeMeetingFilters {
  ai_committee_id?: number | null;
  meeting_type?: MeetingType | null;
  attendance_policy?: AttendancePolicy | null;
  scheduled_at_from?: string | null;
  scheduled_at_to?: string | null;
  per_page?: number;
  page?: number;
}

export interface CreateCommitteeMeetingData {
  ai_committee_id: number;
  meeting_type: MeetingType;
  scheduled_at: string;
  duration_minutes?: number | null;
  agenda: string;
  materials_link?: string | null;
  attendance_policy: AttendancePolicy;
  attendance_roster?: string[] | null;
  minutes_link?: string | null;
}

export interface UpdateCommitteeMeetingData extends Partial<CreateCommitteeMeetingData> {}

