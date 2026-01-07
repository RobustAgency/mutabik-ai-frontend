import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";

export interface TeamMember {
  email: string;
  role: string;
}

export interface InviteTeamRequest {
  members: TeamMember[];
}

export interface InviteTeamResponse {
  error: boolean;        // false = success
  message: string;
  data: {
    failed?: string[] | { email: string }[];
  } | null;
}


export const inviteApi = createApi({
  reducerPath: "inviteApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    inviteTeam: builder.mutation<InviteTeamResponse, InviteTeamRequest>({
      query: (body) => ({ url: "/invite-members", method: "POST", data: body }),
    }),
  }),
});

export const { useInviteTeamMutation } = inviteApi;
