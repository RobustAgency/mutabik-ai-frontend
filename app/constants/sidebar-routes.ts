import {
  LayoutGrid,
  House,
  LucideIcon,
  Users2,
  Box,
  Landmark,
  ClipboardList,
  FileBox,
  Database,
  FolderKanban,
  Users,
  ShieldCheck,
  FileCheck2,
  Building2,
  ScrollText,
  Settings,
  Brain,
  BookOpen,
  BarChart3,
  UserCog,
  Network,
  SlidersHorizontal,
  BellDot,
  FileSearch,
  LineChart,
  Trash2,
  Files,
  FileArchive,
  Layers3,
  FileCog,
  Activity,
  Workflow,
  CheckCircle2,
  FileBarChart,
  Lock,
  Link2,
  Calendar,
} from "lucide-react";

export type RouteItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  children?: RouteItem[];
  /** Permission name required to see this route (typically the .view permission) */
  permission?: string;
};

// --- Routes ---
export const adminRoutes: RouteItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: House },
  { href: "/admin/projects", label: "Projects", icon: LayoutGrid },
  {
    href: "",
    label: "Compliance Library",
    icon: Landmark,
    children: [
      {
        href: "/admin/compliance-library/frameworks",
        label: "Frameworks",
        icon: House,
      },
      { href: "/admin/compliance-library/requirements", label: "Requirements", icon: FileBox },
      // { href: "/admin/compliance-library/tags", label: "Tags" },
      { href: "/admin/compliance-library/controls", label: "Controls", icon: FileBox },
      { href: "/admin/compliance-library/requirement-controls", label: "Requirement Controls", icon: Link2 },
      // { href: "/admin/compliance-library/compliance-evidences", label: "Compliance Evidence", icon: FileCheck2 },
      // { href: "/admin/compliance-library/regulatory-submissions", label: "Regulatory Submissions", icon: ScrollText },
    ],
  },
  {
    href: "",
    label: "Users Administration",
    icon: Users2,
    children: [
      // { href: "/admin/users-administration/admin-users", label: "Admins" },
      { href: "/admin/users-administration/customers", label: "Customers" },
    ],
  },
  { href: "/admin/organizations", label: "Organizations", icon: Building2 },
];

export const userRoutes: RouteItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: House,
    // children: [{ href: "/dashboard", label: "My Workspace", icon: LayoutGrid }],
  },

  {
    href: "/core-assets/ai-use-cases",
    label: "Core Assets",
    icon: FileBox,
    children: [
      { href: "/core-assets/ai-use-cases", label: "AI Use Cases", icon: Brain, permission: "core-assets.use-cases.view" },
      {
        href: "/core-assets/ai-models",
        label: "AI Models",
        icon: Box,
        permission: "core-assets.ai-models.view",
        children: [
          {
            href: "/core-assets/ai-models/versions",
            label: "Model Versions",
            icon: Layers3,
            permission: "core-assets.ai-model-versions.view",
          },
          {
            href: "/core-assets/ai-models/cards",
            label: "Model Cards",
            icon: FileCog,
            permission: "core-assets.ai-model-cards.view",
          },
          {
            href: "/core-assets/ai-models/link-use-case",
            label: "Link Use Case",
            icon: Link2,
            permission: "core-assets.ai-model-use-cases.view",
          },
          {
            href: "/core-assets/ai-models/artifacts",
            label: "Model Artifacts",
            icon: Layers3,
            permission: "core-assets.ai-model-artifacts.view",
          },
          {
            href: "/core-assets/ai-models/artifact-access-logs",
            label: "Artifact Access Logs",
            icon: Layers3,
            permission: "core-assets.artifact-access-logs.view",
          },
        ],
      },
      {
        href: "/core-assets/stakeholders",
        label: "Stakeholders",
        icon: Users,
        permission: "core-assets.stakeholders.view",
      },
      {
        href: "/core-assets/data/registry",
        label: "Datasets & Data Sources",
        icon: Database,
        children: [
          {
            href: "/core-assets/data/registry",
            label: "Datasets Registry",
            icon: FileArchive,
            permission: "core-assets.datasets.view",
          },
          {
            href: "/core-assets/data/sources",
            label: "Data Sources",
            icon: FolderKanban,
            permission: "core-assets.data-sources.view",
          },
          {
            href: "/core-assets/data/elements",
            label: "Data Elements",
            icon: Files,
            permission: "core-assets.data-elements.view",
          },
          {
            href: "/core-assets/data/snapshots",
            label: "Dataset Snapshots",
            icon: Layers3,
            permission: "core-assets.dataset-snapshots.view",
          },
          {
            href: "/core-assets/data/model-links",
            label: "Model-Dataset Links",
            icon: Network,
            permission: "core-assets.ai-model-datasets.view",
          },
          {
            href: "/core-assets/data/subject-population",
            label: "Subject Population",
            icon: Users,
            permission: "core-assets.dataset-subject-populations.view",
          },
        ],
      },
      {
        href: "/core-assets/vendors",
        label: "Vendors & Third Parties",
        icon: Building2,
        permission: "core-assets.vendors.view",
      },
      {
        href: "/core-assets/agreements",
        label: "Agreements",
        icon: FileBox,
        permission: "core-assets.agreements.view",
      },
      {
        href: "/core-assets/ai-assets",
        label: "AI Assets",
        icon: Brain,
        permission: "core-assets.ai-assets.view",
      },
    ],
  },

  {
    href: "/risk-compliance/ai-risk-management",
    label: "Risk Management & Compliance",
    icon: ShieldCheck,
    children: [
      {
        href: "/risk-compliance/ai-risk-management/register",
        label: "AI Risk Management",
        icon: ClipboardList,
        children: [
          {
            href: "/risk-compliance/ai-risk-management/register",
            label: "Risk Register",
            icon: FileSearch,
            permission: "risk-management-and-compliance.ai-risk-register.view",
          },
          {
            href: "/risk-compliance/ai-risk-management/methodologies",
            label: "Risk Methodologies",
            icon: BookOpen,
            permission: "risk-management-and-compliance.risk-methodologies.view",
          },
          {
            href: "/risk-compliance/ai-risk-management/treatment",
            label: "Risk Treatment Plans",
            icon: CheckCircle2,
            permission: "risk-management-and-compliance.ai-risk-treatments.view",
          },
          {
            href: "/risk-compliance/ai-risk-management/kri",
            label: "KRI Indicators",
            icon: LineChart,
            permission: "risk-management-and-compliance.kri-indicators.view",
          },
        ],
      },
      {
        href: "/projects",
        label: "Compliance Management",
        icon: Landmark,
        children: [
          {
            href: "/projects",
            label: "Compliance Projects",
            icon: FolderKanban,
            permission: "risk-management-and-compliance.projects.view",
          },
          {
            href: "/compliance-evidences",
            label: "Compliance Evidence",
            icon: FileCheck2,
            permission: "risk-management-and-compliance.compliance-evidences.view",
          },
          {
            href: "/regulatory-submissions",
            label: "Regulatory Submissions",
            icon: ScrollText,
            permission: "risk-management-and-compliance.regulatory-submissions.view",
          },
        ],
      },
    ],
  },

  {
    href: "/privacy/ropa",
    label: "Privacy & Data Protection",
    icon: Lock,
    children: [
      {
        href: "/privacy/ropa",
        label: "ROPA (Processing Activities)",
        icon: FileSearch,
        permission: "privacy-and-data-protection.record-of-processing-activities.view",
      },
      {
        href: "/privacy/consent",
        label: "Consent Management",
        icon: CheckCircle2,
        children: [
          {
            href: "/privacy/consent/consents",
            label: "User Consents",
            icon: Users,
            permission: "privacy-and-data-protection.user-consents.view",
          },
          {
            href: "/privacy/consent/scopes",
            label: "Consent Scopes",
            icon: SlidersHorizontal,
            permission: "privacy-and-data-protection.consent-scopes.view",
          },
          {
            href: "/privacy/consent/coverage",
            label: "Consent Coverage",
            icon: BarChart3,
            permission: "privacy-and-data-protection.consent-coverages.view",
          },
          {
            href: "/privacy/consent/records",
            label: "Consent Records",
            icon: FileSearch,
            permission: "privacy-and-data-protection.consent-records.view",
          },
        ],
      },
      { href: "/privacy/dsar", label: "DSAR Log", icon: FileBarChart, permission: "privacy-and-data-protection.data-subject-request-accesses.view" },
      {
        href: "/privacy/dpia",
        label: "DPIA",
        icon: ShieldCheck,
        permission: "privacy-and-data-protection.data-protection-impact-assessments.view",
      },
      {
        href: "/privacy/privacy-incidents",
        label: "Privacy Incidents",
        icon: Activity,
        permission: "privacy-and-data-protection.privacy-incidents.view",
      },
    ],
  },

  {
    href: "/governance",
    label: "Governance & Oversight",
    icon: ScrollText,
    children: [
      {
        href: "/governance/ai-committees",
        label: "Committees & Decisions",
        icon: Users2,
        children: [
          {
            href: "/governance/ai-committees",
            label: "AI Committees",
            icon: Brain,
            permission: "governance-and-oversight.ai-committees.view",
          },
          {
            href: "/governance/committee-memberships",
            label: "Committee Memberships",
            icon: Users,
            permission: "governance-and-oversight.committee-memberships.view",
          },
          {
            href: "/governance/committee-meetings",
            label: "Committee Meetings",
            icon: Calendar,
            permission: "governance-and-oversight.committee-meetings.view",
          },
          {
            href: "/governance/committee-actions",
            label: "Committee Actions",
            icon: CheckCircle2,
            permission: "governance-and-oversight.committee-actions.view",
          },
          {
            href: "/governance/committee-decisions",
            label: "Committee Decisions",
            icon: FileCheck2,
            permission: "governance-and-oversight.committee-decisions.view",
          },
        ],
      },
      {
        href: "/governance/oversight",
        label: "Transparency & Oversight",
        icon: BarChart3,
      },
      {
        label: "Incident Management",
        href: "/governance/incidents",
        icon: Activity,
        children: [
          // {
          //   href: "/governance/incidents",
          //   label: "AI Incidents",
          //   icon: Activity,
          // },
          {
            href: "/governance/incidents/alerts",
            label: "Incident Alerts",
            icon: BellDot,
            permission: "governance-and-oversight.incident-alerts.view",
          },
          {
            href: "/governance/incidents/actions",
            label: "Incident Actions",
            icon: CheckCircle2,
            permission: "governance-and-oversight.incident-actions.view",
          },
          {
            href: "/governance/incidents/rca",
            label: "Root Cause Analyses",
            icon: FileSearch,
            permission: "governance-and-oversight.incident-root-cause-analyses.view",
          },
          {
            href: "/governance/incidents/notifications",
            label: "Notifications",
            icon: BellDot,
            permission: "governance-and-oversight.incident-notifications.view",
          },
          {
            href: "/governance/incidents/capa",
            label: "CAPA",
            icon: FileCheck2,
            permission: "governance-and-oversight.corrective-preventive-actions.view",
          },
        ],
      },
    ],
  },

  {
    href: "/assurance",
    label: "Assurance & Performance",
    icon: Activity,
    children: [
      {
        href: "/assurance/assessments",
        label: "Assessments & Assurance",
        icon: FileCheck2,
      },
      {
        href: "/assurance/performance",
        label: "Performance & Reliability",
        icon: LineChart,
      },
    ],
  },

  {
    href: "/operations",
    label: "Lifecycle & Operations",
    icon: Workflow,
    children: [
      {
        href: "/operations/change-requests",
        label: "Change Requests",
        icon: FileCog,
      },
      { href: "/operations/gate-checks", label: "Gate Checks", icon: Landmark },
      { href: "/operations/releases", label: "Releases", icon: FileArchive },
      {
        href: "/operations/post-deploy",
        label: "Post-Deploy Reviews",
        icon: BarChart3,
      },
      {
        href: "/operations/decommissioning",
        label: "Decommissioning",
        icon: Trash2,
      },
    ],
  },

  {
    href: "/enablement",
    label: "Enablement & Knowledge",
    icon: Brain,
    children: [
      {
        href: "/enablement/training",
        label: "Training & Competency",
        icon: BookOpen,
      },
      {
        href: "/enablement/knowledge-hub",
        label: "Knowledge Hub (Policies, SOPs, Templates)",
        icon: FileSearch,
      },
    ],
  },

  {
    href: "/reports",
    label: "Reports & Analytics",
    icon: BarChart3,
    children: [
      {
        href: "/reports/executive",
        label: "Executive Reports",
        icon: BarChart3,
      },
      {
        href: "/reports/compliance",
        label: "Compliance Dashboards",
        icon: LineChart,
      },
      {
        href: "/reports/operational",
        label: "Operational KPIs",
        icon: Activity,
      },
    ],
  },

  {
    href: "/users",
    label: "Administration",
    icon: Settings,
    children: [
      { href: "/users", label: "Users", icon: Users },
      { href: "/administration/users", label: "Roles", icon: UserCog },
      {
        href: "/administration/integrations",
        label: "Integrations & Connectors",
        icon: SlidersHorizontal,
      },
      {
        href: "/administration/settings",
        label: "Settings & Configuration",
        icon: Settings,
      },
      {
        href: "/administration/audit",
        label: "Audit Trails & Notifications",
        icon: BellDot,
      },
    ],
  },
];
