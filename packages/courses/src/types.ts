export type CourseItem = {
  id: string;
  name: string;
  code: string;
  status: "Published" | "Draft" | "Archived";
  delivery: "Live (class-based)" | "Self-paced" | "Live and self-paced";
  enrolled: number;
  created: string;
  modified: string;
  category: string;
  hours: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBookmarked?: boolean;
  description: string;
};

export type ClassItem = {
  id: string;
  courseId: string;
  name: string;
  code: string;
  sessionsCount: number;
  status: "Scheduled" | "Tentative" | "Confirmed" | "Completed" | "Cancelled";
  start: string;
  enrolled: number;
  max: number;
  instructor: string;
  location: string;
};

export type EnrollmentItem = {
  id: string;
  learnerName: string;
  learnerEmail: string;
  courseName: string;
  status: "Completed" | "In Progress" | "Not Started";
  progressPercent: number;
  enrolledDate: string;
  completionDate?: string;
  score?: number;
};

export type LearningPlanItem = {
  id: string;
  title: string;
  coursesCount: number;
  audience: string;
  assignedUsers: number;
  completionRate: number;
  status: "Active" | "Draft";
};
