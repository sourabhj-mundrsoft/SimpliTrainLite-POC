export interface AchievementRecord {
  id: string;
  userName: string;
  userEmail: string;
  achievementName: string;
  courseName: string;
  issueDate: string;
  expirationDate: string | null;
  score: number | null;
  credentialId: string;
  status: "Active" | "Expiring Soon" | "Expired" | "Revoked";
  badgeUrl?: string;
  organizationName?: string;
  certificateUrl?: string;
}

export type UserSearchFilter = {
  field?: string | null;
  comparisonType?: string | null;
  negate?: boolean;
  value?: string | null;
  value2?: string | null;
  value3?: string | null;
  timePeriodUnit?: string | null;
  filters?: UserSearchFilter[] | null;
  dynamicValue?: number[] | null;
  dynamicValue2?: number[] | null;
};

export type UserSearchSort = {
  field?: string | null;
  direction?: "asc" | "desc" | string | null;
};

export interface AchievementSearchOptions {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  statusFilter?: string;
  organizationId?: number;
  token?: string;
  baseUrl?: string;
  useProxy?: boolean;
  filters?: UserSearchFilter[];
  sort?: UserSearchSort[];
}

export interface AchievementApiError {
  status?: number;
  type: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "SERVER_ERROR" | "NETWORK_ERROR" | "PARSE_ERROR" | "UNKNOWN";
  message: string;
  rawDetails?: string;
  timestamp: string;
}

export interface AchievementSearchResult {
  success: boolean;
  data: AchievementRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  error?: AchievementApiError;
  isDemoFallback?: boolean;
}

export const FALLBACK_SAMPLE_ACHIEVEMENTS: AchievementRecord[] = [
  {
    id: "ach-101",
    userName: "Elena Rostova",
    userEmail: "elena.rostova@example.com",
    achievementName: "Certified Enterprise Safety Specialist",
    courseName: "Workplace Health & Safety Standards 2026",
    issueDate: "2026-10-18",
    expirationDate: "2028-10-18",
    score: 98,
    credentialId: "CRT-SAF-99412",
    status: "Active",
    organizationName: "SimpliTrain Global Enterprise",
  },
  {
    id: "ach-102",
    userName: "Marcus Vance",
    userEmail: "marcus.vance@example.com",
    achievementName: "SOC 2 Type II Lead Auditor Accreditation",
    courseName: "SOC 2 Type II Deep Dive - Engineering Cohort",
    issueDate: "2026-10-15",
    expirationDate: "2027-10-15",
    score: 94,
    credentialId: "CRT-SOC2-88219",
    status: "Active",
    organizationName: "Security & Trust Operations",
  },
  {
    id: "ach-103",
    userName: "Aarav Sharma",
    userEmail: "aarav.sharma@example.com",
    achievementName: "Data Privacy & GDPR Practitioner Certificate",
    courseName: "GDPR & Data Subject Rights Lab",
    issueDate: "2026-09-28",
    expirationDate: "2026-11-20",
    score: 88,
    credentialId: "CRT-GDPR-77312",
    status: "Expiring Soon",
    organizationName: "Legal & Regulatory Compliance",
  },
  {
    id: "ach-104",
    userName: "Priya Patel",
    userEmail: "priya.patel@example.com",
    achievementName: "Customer Service Escalation & Conflict Resolution",
    courseName: "Customer Service Escalations & Roleplay",
    issueDate: "2026-09-10",
    expirationDate: "2027-09-10",
    score: 92,
    credentialId: "CRT-CS-66104",
    status: "Active",
    organizationName: "Customer Success Academy",
  },
  {
    id: "ach-105",
    userName: "Jordan Hayes",
    userEmail: "jordan.hayes@example.com",
    achievementName: "ISO 27001 Information Security Lead Implementer",
    courseName: "ISO 27001 Cyber Infrastructure Governance",
    issueDate: "2025-10-01",
    expirationDate: "2026-10-01",
    score: 85,
    credentialId: "CRT-ISO-55092",
    status: "Expired",
    organizationName: "Information Security Group",
  },
  {
    id: "ach-106",
    userName: "Sarah Lin",
    userEmail: "sarah.lin@example.com",
    achievementName: "Anti-Money Laundering (AML) Compliance Certificate",
    courseName: "Financial Crime & AML Screening Protocols",
    issueDate: "2026-08-14",
    expirationDate: "2027-08-14",
    score: 96,
    credentialId: "CRT-AML-44910",
    status: "Active",
    organizationName: "Financial Integrity Division",
  },
  {
    id: "ach-107",
    userName: "David Kim",
    userEmail: "david.kim@example.com",
    achievementName: "HIPAA Security Rule Administrative Officer",
    courseName: "HIPAA Healthcare Privacy & Security Foundations",
    issueDate: "2026-07-22",
    expirationDate: "2027-07-22",
    score: 90,
    credentialId: "CRT-HIP-33821",
    status: "Active",
    organizationName: "Healthcare Compliance Dept",
  },
  {
    id: "ach-108",
    userName: "Contractor Temp",
    userEmail: "contractor@partner.net",
    achievementName: "Basic Information Security Fundamentals",
    courseName: "Vendor Security & Acceptable Use Policy",
    issueDate: "2025-05-10",
    expirationDate: "2026-05-10",
    score: 74,
    credentialId: "CRT-SEC-22709",
    status: "Revoked",
    organizationName: "Partner Vendor Network",
  },
];

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromLocal =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("simplitrain_token") ||
      localStorage.getItem("lms_token") ||
      localStorage.getItem("achievement_api_token") ||
      localStorage.getItem("course_api_token");
    if (fromLocal) return fromLocal;

    const fromSession =
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("simplitrain_token") ||
      sessionStorage.getItem("achievement_api_token");
    if (fromSession) return fromSession;

    const cookieMatch = document.cookie.match(/(?:^|; )(?:authToken|token|simplitrain_token)=([^;]*)/);
    if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  } catch {
    // ignore
  }
  return null;
}

export function setStoredAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = token.trim();
    if (!trimmed) {
      clearStoredAuthToken();
      return;
    }
    localStorage.setItem("authToken", trimmed);
    localStorage.setItem("achievement_api_token", trimmed);
    localStorage.setItem("simplitrain_token", trimmed);
    document.cookie = `authToken=${encodeURIComponent(trimmed)}; path=/; max-age=604800; SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function clearStoredAuthToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("achievement_api_token");
    localStorage.removeItem("simplitrain_token");
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "token=; path=/; max-age=0";
  } catch {
    // ignore
  }
}

function normalizeStatus(raw: string | undefined | null, expiryDate?: string | null): AchievementRecord["status"] {
  const str = (raw || "").toLowerCase();
  if (str.includes("revok")) return "Revoked";
  if (str.includes("expir") && !str.includes("soon")) return "Expired";
  
  if (expiryDate) {
    const exp = new Date(expiryDate).getTime();
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (exp < now) return "Expired";
    if (exp - now <= thirtyDays) return "Expiring Soon";
  }

  return "Active";
}

export function mapRawItemToAchievement(raw: Record<string, unknown>, index: number): AchievementRecord {
  const id = String(raw.id ?? raw.achievementId ?? raw.userCertificationId ?? `ach-${index + 1}`);
  
  const userName = String(
    raw.userName ??
    raw.userFullName ??
    raw.learnerName ??
    raw.recipientName ??
    raw.name ??
    `Learner ${id}`
  );

  const userEmail = String(
    raw.userEmail ??
    raw.email ??
    raw.recipientEmail ??
    `${userName.toLowerCase().replace(/[^a-z0-9]/g, ".")}@example.com`
  );

  const achievementName = String(
    raw.achievementName ??
    raw.certificateName ??
    raw.certificationName ??
    raw.title ??
    "Certificate of Professional Achievement"
  );

  const courseName = String(
    raw.courseName ??
    raw.courseTitle ??
    raw.curriculumName ??
    raw.programName ??
    "Executive Curriculum Training"
  );

  const issueDate = raw.issueDate ?? raw.issuedAt ?? raw.earnedDate ?? raw.dateEarned ?? raw.completedDate ?? raw.createdDate;
  const issueDateStr = typeof issueDate === "string" ? issueDate.slice(0, 10) : new Date().toISOString().slice(0, 10);

  const expDate = raw.expirationDate ?? raw.expiresAt ?? raw.validUntil ?? raw.expiryDate;
  const expDateStr = typeof expDate === "string" ? expDate.slice(0, 10) : null;

  const rawScore = raw.score ?? raw.grade ?? raw.percentage ?? raw.assessmentScore;
  const score = typeof rawScore === "number" ? rawScore : typeof rawScore === "string" && !isNaN(Number(rawScore)) ? Number(rawScore) : null;

  const credentialId = String(
    raw.certificateNumber ??
    raw.credentialId ??
    raw.code ??
    raw.certificationCode ??
    `CRT-${id.slice(-6).toUpperCase()}`
  );

  const status = normalizeStatus(
    (raw.status as string) || (raw.state as string) || (raw.certificationStatus as string),
    expDateStr
  );

  return {
    id,
    userName,
    userEmail,
    achievementName,
    courseName,
    issueDate: issueDateStr,
    expirationDate: expDateStr,
    score,
    credentialId,
    status,
    organizationName: typeof raw.organizationName === "string" ? raw.organizationName : undefined,
    badgeUrl: typeof raw.badgeUrl === "string" ? raw.badgeUrl : undefined,
    certificateUrl: typeof raw.certificateUrl === "string" ? raw.certificateUrl : undefined,
  };
}

export async function fetchAchievementsFromApi(
  options: AchievementSearchOptions = {}
): Promise<AchievementSearchResult> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.max(1, options.pageSize ?? 10);
  const token = options.token ?? getStoredAuthToken();

  // If useProxy is true, or if relative route is explicitly requested
  const targetBase = options.useProxy
    ? "/api/reports/achievements"
    : (options.baseUrl || "https://lmsapidev.simplitrain.net").replace(/\/+$/, "");

  const isProxy = targetBase.startsWith("/");
  const urlObj = new URL(
    isProxy ? targetBase : `${targetBase}/api/v3/Achievement/Search`,
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
  );

  // Build standard query params according to OpenAPI spec
  urlObj.searchParams.set("Page", String(page));
  urlObj.searchParams.set("PageSize", String(pageSize));
  if (options.organizationId !== undefined) {
    urlObj.searchParams.set("OrganizationId", String(options.organizationId));
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    headers["Authorization"] = bearer;
  }

  try {
    const res = await fetch(urlObj.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      let rawDetails = "";
      try {
        const text = await res.text();
        rawDetails = text;
      } catch {
        // ignore
      }

      let errorType: AchievementApiError["type"] = "UNKNOWN";
      let userMessage = `API request failed with HTTP ${res.status}`;

      if (res.status === 401) {
        errorType = "UNAUTHORIZED";
        userMessage =
          "Authentication required (HTTP 401). An authorized Bearer token is needed to access https://lmsapidev.simplitrain.net/api/v3/Achievement/Search.";
      } else if (res.status === 403) {
        errorType = "FORBIDDEN";
        userMessage = "Access forbidden (HTTP 403). Your account does not have permission to view achievement records.";
      } else if (res.status === 404) {
        errorType = "NOT_FOUND";
        userMessage = "Endpoint not found (HTTP 404).";
      } else if (res.status >= 500) {
        errorType = "SERVER_ERROR";
        userMessage = `SimpliTrain LMS service error (HTTP ${res.status}). The upstream server may be undergoing maintenance.`;
      }

      return {
        success: false,
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 1,
        error: {
          status: res.status,
          type: errorType,
          message: userMessage,
          rawDetails: rawDetails.slice(0, 500),
          timestamp: new Date().toISOString(),
        },
      };
    }

    const json = await res.json();

    // Parse various JSON wrappers
    const rawList: Record<string, unknown>[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.items)
      ? json.items
      : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.results)
      ? json.results
      : Array.isArray(json?.rows)
      ? json.rows
      : Array.isArray(json?.achievements)
      ? json.achievements
      : [];

    const mapped = rawList.map((item, idx) => mapRawItemToAchievement(item, idx));

    const totalCount =
      typeof json?.totalCount === "number"
        ? json.totalCount
        : typeof json?.total === "number"
        ? json.total
        : typeof json?.count === "number"
        ? json.count
        : mapped.length;

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      success: true,
      data: mapped,
      total: totalCount,
      page,
      pageSize,
      totalPages,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to connect to API server";
    return {
      success: false,
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      error: {
        type: "NETWORK_ERROR",
        message: `Network connection failed: ${errorMsg}. Verify connection to https://lmsapidev.simplitrain.net.`,
        rawDetails: String(err),
        timestamp: new Date().toISOString(),
      },
    };
  }
}
