import { baseApi } from "@/lib/api/baseApi";
import type {
  Profile,
  ProfileResponse,
  ProfilePermission,
} from "@/service/app/profile";

/**
 * Flattens all unique permissions from the **new** backend structure into
 * a single `ProfilePermission[]`.
 *
 * New backend shape (as in the example response):
 *
 * \{
 *   "permissions": {
 *     "core-assets": {
 *       "ai-models": [ { id, name, guard_name, ... }, ... ],
 *       "ai-model-versions": [ ... ],
 *       ...
 *     },
 *     "risk-management-and-compliance": { ... },
 *     ...
 *   }
 * \}
 *
 * We expose a flat, de-duplicated `ProfilePermission[]` so the rest of the app
 * (e.g. `usePermissions`) can keep doing O(1) lookups.
 */
function flattenPermissions(profile: any): ProfilePermission[] {
  const tree = profile?.permissions as
    | Record<string, Record<string, ProfilePermission[]>>
    | undefined;

  if (!tree || typeof tree !== "object") return [];

  const seen = new Set<number>();
  const result: ProfilePermission[] = [];

  for (const modulePermissions of Object.values(tree)) {
    if (!modulePermissions || typeof modulePermissions !== "object") continue;

    for (const permissionList of Object.values(modulePermissions)) {
      if (!Array.isArray(permissionList)) continue;

      for (const perm of permissionList) {
        if (!perm) continue;
        if (typeof perm.id !== "number") continue;
        if (seen.has(perm.id)) continue;

        seen.add(perm.id);
        result.push({
          id: perm.id,
          name: perm.name,
          guard_name: perm.guard_name,
        });
      }
    }
  }

  return result;
}

export const profileApi = baseApi.injectEndpoints({
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

