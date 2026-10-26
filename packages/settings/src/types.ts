export type SettingsTabId =
  | "organization"
  | "branding"
  | "system"
  | "roles"
  | "fields"
  | "locations"
  | "integrations";

export type SettingsTab = Readonly<{
  id: SettingsTabId;
  label: string;
  description: string;
  icon: string;
}>;

export type OrganizationSettings = {
  // Identity
  name: string;
  abbreviation: string;
  ownerName: string;
  description: string;
  culture: string;
  timeZone: string;
  franchiseId: string;
  externalId: string;

  // Contact & Address
  email: string;
  phone: string;
  fax: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Access & Registration
  assignableToUsers: boolean;
  enableAnonymousRegistration: boolean;
  termsUrl: string;

  // Class & Catalog Defaults
  enableCourseCatalog: boolean;
  showPriceOnCatalog: boolean;
  hiddenPriceAction: "self-enroll" | "contact-admin";
  lateCancelWindowDays: number;
  lateCancelWarning: string;
  defaultClassMinCapacity: number;
  defaultClassMaxCapacity: number;
  defaultClassRecordingMode: "Automatic" | "Disabled" | "Manual";
  defaultClassStatus: string;
  businessHoursStart: string;
  businessHoursEnd: string;
};

export type BrandingSettings = {
  siteTitle: string;
  logoUrl: string;
  themeMode: "light" | "dark" | "system";
  primaryAccent: string;
  loginPageTitle: string;
  externalRegistrationLink: string;
  customCss: string;
};

export type SystemSettings = {
  siteStatus: "active" | "maintenance" | "read-only";
  maintenanceMessage: string;
  passwordMinLength: number;
  requireSpecialCharacter: boolean;
  requireNumber: boolean;
  maxFailedLogins: number;
  defaultWorkWeekStart: "Monday" | "Sunday";
  enableSimplassessSurveys: boolean;
  enableCredlyBadging: boolean;
};

export type RoleItem = {
  id: string;
  name: string;
  description: string;
  isBuiltin: boolean;
  isAdmin: boolean;
  userCount: number;
};

export type CustomFieldItem = {
  id: string;
  name: string;
  target: "class" | "user" | "company";
  type: "text" | "number" | "select" | "checkbox";
  isRequired: boolean;
  isEnabled: boolean;
};

export type LocationItem = {
  id: string;
  name: string;
  code: string;
  city: string;
  roomCount: number;
  isActive: boolean;
};

export type IntegrationItem = {
  id: string;
  name: string;
  category: "sso" | "meeting" | "payment" | "webhooks";
  status: "connected" | "disconnected";
  description: string;
};

export type AllSettings = {
  organization: OrganizationSettings;
  branding: BrandingSettings;
  system: SystemSettings;
  roles: RoleItem[];
  fields: CustomFieldItem[];
  locations: LocationItem[];
  integrations: IntegrationItem[];
};

export const defaultSettings: AllSettings = {
  organization: {
    name: "Acme Training Center",
    abbreviation: "ATC",
    ownerName: "Sarah Connor",
    description: "Enterprise learning and certification center delivering premium instructor-led and self-paced courses.",
    culture: "en-US",
    timeZone: "America/New_York (EST)",
    franchiseId: "FRAN-042",
    externalId: "EXT-8821",
    email: "admin@acmetraining.com",
    phone: "+1 (555) 234-5678",
    fax: "+1 (555) 234-5679",
    addressLine1: "100 Innovation Boulevard",
    addressLine2: "Suite 400",
    city: "Boston",
    state: "MA",
    zipCode: "02110",
    country: "United States",
    assignableToUsers: true,
    enableAnonymousRegistration: false,
    termsUrl: "https://acmetraining.com/terms",
    enableCourseCatalog: true,
    showPriceOnCatalog: true,
    hiddenPriceAction: "self-enroll",
    lateCancelWindowDays: 7,
    lateCancelWarning: "Are you sure you want to cancel? Late cancellation fee may apply.",
    defaultClassMinCapacity: 4,
    defaultClassMaxCapacity: 25,
    defaultClassRecordingMode: "Automatic",
    defaultClassStatus: "Scheduled",
    businessHoursStart: "08:00",
    businessHoursEnd: "17:00",
  },
  branding: {
    siteTitle: "SimpliTrain Lite",
    logoUrl: "",
    themeMode: "light",
    primaryAccent: "#4F46E5",
    loginPageTitle: "Empowering People to Succeed through Learning",
    externalRegistrationLink: "",
    customCss: "",
  },
  system: {
    siteStatus: "active",
    maintenanceMessage: "The platform is scheduled for brief maintenance tonight at 11 PM UTC.",
    passwordMinLength: 8,
    requireSpecialCharacter: true,
    requireNumber: true,
    maxFailedLogins: 5,
    defaultWorkWeekStart: "Monday",
    enableSimplassessSurveys: true,
    enableCredlyBadging: true,
  },
  roles: [
    {
      id: "super-user",
      name: "Super User",
      description: "Full platform permissions and application settings management.",
      isBuiltin: true,
      isAdmin: true,
      userCount: 2,
    },
    {
      id: "center-admin",
      name: "Center Administrator",
      description: "Runs day-to-day settings of the Center: people, courses, classes and rooms.",
      isBuiltin: false,
      isAdmin: true,
      userCount: 6,
    },
    {
      id: "instructor",
      name: "Instructor",
      description: "Delivers classes, tracks attendance, and reviews learner submissions.",
      isBuiltin: true,
      isAdmin: false,
      userCount: 18,
    },
    {
      id: "learner",
      name: "Learner",
      description: "Enrolls in courses, attends classes, and accesses certificates.",
      isBuiltin: true,
      isAdmin: false,
      userCount: 420,
    },
  ],
  fields: [
    {
      id: "f-cost-center",
      name: "Department / Cost Center",
      target: "user",
      type: "text",
      isRequired: false,
      isEnabled: true,
    },
    {
      id: "f-catering-pref",
      name: "Dietary Preference",
      target: "class",
      type: "select",
      isRequired: false,
      isEnabled: true,
    },
    {
      id: "f-billing-code",
      name: "Corporate Billing Code",
      target: "company",
      type: "text",
      isRequired: true,
      isEnabled: true,
    },
  ],
  locations: [
    {
      id: "loc-boston",
      name: "Boston HQ Learning Center",
      code: "BOS-01",
      city: "Boston, MA",
      roomCount: 6,
      isActive: true,
    },
    {
      id: "loc-austin",
      name: "Austin Tech Training Lab",
      code: "ATX-02",
      city: "Austin, TX",
      roomCount: 4,
      isActive: true,
    },
    {
      id: "loc-virtual",
      name: "Global Virtual Classrooms",
      code: "VRT-00",
      city: "Online (Zoom / Teams)",
      roomCount: 12,
      isActive: true,
    },
  ],
  integrations: [
    {
      id: "int-saml",
      name: "SAML 2.0 / Okta SSO",
      category: "sso",
      status: "connected",
      description: "Single sign-on enterprise authentication via Okta or Azure AD.",
    },
    {
      id: "int-zoom",
      name: "Zoom for Classrooms",
      category: "meeting",
      status: "connected",
      description: "Automatic meeting creation and attendance recording sync.",
    },
    {
      id: "int-stripe",
      name: "Stripe Payment Gateway",
      category: "payment",
      status: "connected",
      description: "Card checkout for public course catalog registrations.",
    },
    {
      id: "int-webhooks",
      name: "Outbound Webhooks",
      category: "webhooks",
      status: "disconnected",
      description: "Trigger external webhooks on class completion or user enrollment.",
    },
  ],
};
