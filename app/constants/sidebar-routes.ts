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
  GlobeLock,
  Trash2,
  FileKey2,
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
} from "lucide-react";

export type RouteItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  children?: RouteItem[];
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
      { href: "/admin/compliance-library/requirements", label: "Requirements" },
      { href: "/admin/compliance-library/tags", label: "Tags" },
      { href: "/admin/compliance-library/controls", label: "Controls" },
    ],
  },
  {
    href: "",
    label: "Users Administration",
    icon: Users2,
    children: [
      { href: "/admin/users-administration/admin-users", label: "Admins" },
      { href: "/admin/users-administration/customers", label: "Customers" },
    ],
  },
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
      { href: "/core-assets/ai-use-cases", label: "AI Use Cases", icon: Brain },
      {
        href: "/core-assets/ai-models",
        label: "AI Models",
        icon: Box,
        children: [
          {
            href: "/core-assets/ai-models/versions",
            label: "Model Versions",
            icon: Layers3,
          },
          {
            href: "/core-assets/ai-models/cards",
            label: "Model Cards",
            icon: FileCog,
          },
          {
            href: "/core-assets/ai-models/link-use-case",
            label: "Link Use Case",
            icon: Link2,
          },
          {
            href: "/core-assets/ai-models/artifacts",
            label: "Model Artifacts",
            icon: Layers3,
          },
          {
            href: "/core-assets/ai-models/artifact-access-logs",
            label: "Artifact Access Logs",
            icon: Layers3,
          },
        ],
      },
      {
        href: "/core-assets/stakeholders",
        label: "Stakeholders",
        icon: Users,
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
          },
          {
            href: "/core-assets/data/sources",
            label: "Data Sources",
            icon: FolderKanban,
          },
          {
            href: "/core-assets/data/elements",
            label: "Data Elements",
            icon: Files,
          },
          {
            href: "/core-assets/data/snapshots",
            label: "Dataset Snapshots",
            icon: Layers3,
          },
          {
            href: "/core-assets/data/model-links",
            label: "Model-Dataset Links",
            icon: Network,
          },
          {
            href: "/core-assets/data/subject-population",
            label: "Subject Population",
            icon: Users,
          },
        ],
      },
      {
        href: "/core-assets/vendors",
        label: "Vendors & Third Parties",
        icon: Building2,
      },
      {
        href: "/core-assets/agreements",
        label: "Agreements",
        icon: FileBox,
      },
      {
        href: "/core-assets/ai-assets",
        label: "AI Assets",
        icon: Brain,
      },
    ],
  },

  {
    href: "/risk",
    label: "Risk & Compliance",
    icon: ShieldCheck,
    children: [
      {
        href: "/risk/ai-risk-management",
        label: "AI Risk Management",
        icon: ClipboardList,
        children: [
          {
            href: "/risk/ai-risk-management/register",
            label: "Risk Register",
            icon: FileSearch,
          },
          {
            href: "/risk/ai-risk-management/treatment",
            label: "Risk Treatment Plans",
            icon: CheckCircle2,
          },
          {
            href: "/risk/ai-risk-management/kri",
            label: "KRI Indicators",
            icon: LineChart,
          },
        ],
      },
      {
        href: "/risk/compliance",
        label: "Compliance Management",
        icon: Landmark,
        children: [
          {
            href: "/risk/compliance/frameworks",
            label: "Frameworks & Requirements",
            icon: FileCheck2,
          },
          {
            href: "/risk/compliance/control-catalog",
            label: "Control Catalog",
            icon: FileBox,
          },
          {
            href: "/risk/compliance/mapping",
            label: "Requirement–Control Mapping",
            icon: Network,
          },
          {
            href: "/risk/compliance/evidence",
            label: "Compliance Evidence",
            icon: FileKey2,
          },
          {
            href: "/projects",
            label: "Regulatory Submissions / Projects",
            icon: ScrollText,
          },
        ],
      },
    ],
  },

  {
    href: "/privacy",
    label: "Privacy & Data Protection",
    icon: Lock,
    children: [
      {
        href: "/privacy/ropa",
        label: "ROPA (Processing Activities)",
        icon: FileSearch,
      },
      {
        href: "/privacy/pdp-register",
        label: "PDP Processing Register",
        icon: FileCheck2,
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
          },
          {
            href: "/privacy/consent/scopes",
            label: "Consent Scopes",
            icon: SlidersHorizontal,
          },
          {
            href: "/privacy/consent/coverage",
            label: "Consent Coverage",
            icon: BarChart3,
          },
        ],
      },
      { href: "/privacy/dsar", label: "DSAR Log", icon: FileBarChart },
      { href: "/privacy/tia", label: "Cross-Border TIA", icon: GlobeLock },
      {
        href: "/privacy/retention",
        label: "Retention Policy & Deletion Proof",
        icon: Trash2,
      },
      { href: "/privacy/notices", label: "Privacy Notices", icon: ScrollText },
    ],
  },

  {
    href: "/governance",
    label: "Governance & Oversight",
    icon: ScrollText,
    children: [
      {
        href: "/governance/committees",
        label: "Committees & Decisions",
        icon: Users2,
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
          },
          {
            href: "/governance/incidents/actions",
            label: "Incident Actions",
            icon: CheckCircle2,
          },
          {
            href: "/governance/incidents/rca",
            label: "Root Cause Analyses",
            icon: FileSearch,
          },
          {
            href: "/governance/incidents/notifications",
            label: "Notifications",
            icon: BellDot,
          },
          {
            href: "/governance/incidents/capa",
            label: "CAPA",
            icon: FileCheck2,
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
    href: "/admin",
    label: "Administration",
    icon: Settings,
    children: [
      { href: "/admin/users", label: "Users & Roles", icon: UserCog },
      {
        href: "/admin/integrations",
        label: "Integrations & Connectors",
        icon: SlidersHorizontal,
      },
      {
        href: "/admin/settings",
        label: "Settings & Configuration",
        icon: Settings,
      },
      {
        href: "/admin/audit",
        label: "Audit Trails & Notifications",
        icon: BellDot,
      },
    ],
  },
];
