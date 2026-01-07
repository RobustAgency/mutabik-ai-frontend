import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";

/* -------------------- Types -------------------- */

export interface TeamMember {
  email: string;
  role: string;
}

export interface InviteTeamRequest {
  members: TeamMember[];
}

export interface InviteTeamResponse {
  error: boolean; // false = success
  message: string;
  data: {
    failed?: string[] | { email: string }[];
  } | null;
}

/* -------------------- API -------------------- */

export const inviteApi = createApi({
  reducerPath: "inviteApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"] as const, // ✅ MUST MATCH usersApi
  endpoints: (builder) => ({
    inviteTeam: builder.mutation<
      InviteTeamResponse,
      InviteTeamRequest
    >({
      query: (body) => ({
        url: "/invite-members",
        method: "POST",
        data: body,
      }),

      // 🔥 THIS is what triggers user list refetch
      invalidatesTags: [
        { type: "User", id: "LIST" },
        { type: "User", id: "ORG_LIST" },
      ],
    }),
  }),
});

export const { useInviteTeamMutation } = inviteApi;
