import type { CourseItem } from "./types";

export type ApiCourseDto = {
  id?: string | number;
  courseId?: string | number;
  uuid?: string;
  title?: string;
  name?: string;
  courseName?: string;
  description?: string;
  status?: string;
  language?: string;
  createdBy?: string;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
  duration?: number;
  hours?: number;
  modules?: unknown[];
  category?: string;
  enrolled?: number;
  enrolledCount?: number;
  [key: string]: unknown;
};

export type FetchCoursesOptions = {
  token?: string;
  baseUrl?: string;
};

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromLocal =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("simplitrain_token") ||
      localStorage.getItem("course_api_token");
    if (fromLocal) return fromLocal;

    const fromSession =
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("course_api_token");
    if (fromSession) return fromSession;

    const cookieMatch = document.cookie.match(/(?:^|; )authToken=([^;]*)/);
    if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  } catch { }
  return null;
}

export function setStoredAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("authToken", token);
    localStorage.setItem("course_api_token", token);
    document.cookie = `authToken=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  } catch { }
}

export function clearStoredAuthToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("course_api_token");
    document.cookie = "authToken=; path=/; max-age=0";
  } catch { }
}

export function mapApiCourseToCourseItem(apiCourse: ApiCourseDto): CourseItem {
  const rawId = apiCourse.id ?? apiCourse.courseId ?? apiCourse.uuid;
  const id = rawId ? String(rawId) : `c-${Math.random().toString(36).substring(2, 9)}`;
  const title = String(apiCourse.title ?? apiCourse.name ?? apiCourse.courseName ?? "Untitled Course");

  const rawStatus = (apiCourse.status || "").toLowerCase();
  const status: CourseItem["status"] =
    rawStatus.includes("draft")
      ? "Draft"
      : rawStatus.includes("archive")
        ? "Archived"
        : "Published";

  let delivery: CourseItem["delivery"] = "Live (class-based)";
  if (Array.isArray(apiCourse.modules) && apiCourse.modules.length > 0) {
    delivery = "Self-paced";
  }

  const enrolled =
    typeof apiCourse.enrolled === "number"
      ? apiCourse.enrolled
      : typeof apiCourse.enrolledCount === "number"
        ? apiCourse.enrolledCount
        : 0;

  const createdStr = apiCourse.createdAt
    ? new Date(apiCourse.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "10 Oct 2026";

  const modifiedStr = apiCourse.updatedAt
    ? new Date(apiCourse.updatedAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "22 Oct 2026";

  const category =
    apiCourse.category ||
    (apiCourse.language ? `Curriculum (${apiCourse.language})` : "General");

  const hours =
    typeof apiCourse.hours === "number"
      ? apiCourse.hours
      : typeof apiCourse.duration === "number"
        ? Math.max(1, Math.round(apiCourse.duration / 60))
        : 6;

  return {
    id,
    name: title,
    code: `CRS-${id.slice(-4).toUpperCase()}`,
    status,
    delivery,
    enrolled,
    created: createdStr,
    modified: modifiedStr,
    category,
    hours,
    isNew: false,
    isFeatured: false,
    isBookmarked: false,
    description:
      typeof apiCourse.description === "string" && apiCourse.description.trim()
        ? apiCourse.description
        : "Course provided by SimpliAuthor curriculum service.",
  };
}

export async function fetchCoursesFromApi(
  options: FetchCoursesOptions = {}
): Promise<{
  success: boolean;
  data: CourseItem[];
  error?: string;
  status?: number;
  total?: number;
}> {
  const token = options.token ?? getStoredAuthToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  const base = (
    options.baseUrl || "https://simpliauthorapidev.ourdemoapps.com"
  ).replace(/\/+$/, "");

  const url = `${base}/api/courses`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      let apiErrorMsg = "";
      try {
        const errJson = await res.json();
        apiErrorMsg =
          (typeof errJson?.message === "string" && errJson.message) ||
          (typeof errJson?.error === "string" && errJson.error) ||
          (typeof errJson?.errorMessage === "string" && errJson.errorMessage) ||
          "";
      } catch {
        try {
          const text = await res.text();
          if (text && text.length < 300) apiErrorMsg = text;
        } catch {
          // ignore
        }
      }

      const fallback =
        res.status === 401
          ? "Authentication required"
          : `API request failed with status ${res.status}`;
      const error = apiErrorMsg || fallback;

      return {
        success: false,
        data: [],
        status: res.status,
        error,
      };
    }

    const json = await res.json();
    const rawList = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.items)
          ? json.items
          : null;

    if (rawList) {
      const mapped: CourseItem[] = rawList.map(mapApiCourseToCourseItem);
      return {
        success: true,
        data: mapped,
        status: res.status,
        total: typeof json?.count === "number" ? json.count : mapped.length,
      };
    } else {
      return {
        success: true,
        data: [],
        status: res.status,
        total: 0,
      };
    }
  } catch (err: unknown) {
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : "Failed to fetch from API",
    };
  }
}
