import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import type {
  Profile,
  ProfileResponse,
  ProfilePermission,
} from "@/service/app/profile";

/**
 * Flattens all unique permissions from the user's roles into a single array.
 * The backend returns permissions nested inside each role; this helper
 * de-duplicates them by permission id so the rest of the app can do O(1)
 * lookups via a Set.
 */
function flattenPermissions(profile: Profile): ProfilePermission[] {
  if (profile.permissions && profile.permissions.length > 0) {
    return profile.permissions;
  }

  if (!profile.roles) return [];

  const seen = new Set<number>();
  const result: ProfilePermission[] = [];

  for (const role of profile.roles) {
    for (const perm of role.permissions ?? []) {
      if (!seen.has(perm.id)) {
        seen.add(perm.id);
        result.push(perm);
      }
    }
  }

  return result;
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Profile"] as const,
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      transformResponse: (response: ProfileResponse) => {
        const data = response.data;
        return {
          ...data,
          full_name: data.name ?? data.full_name ?? null,
          permissions: flattenPermissions(data),
        };
      },
      providesTags: [{ type: "Profile", id: "ME" }],
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;

