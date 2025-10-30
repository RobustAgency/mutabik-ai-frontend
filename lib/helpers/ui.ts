export const getStatusBadge = (
  status: string,
  type: "business" | "operational"
) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

  if (type === "business") {
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "planned":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "deprecated":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "retired":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  } else {
    switch (status) {
      case "production":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "testing":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "development":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "not_deployed":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }
};

export const getRiskBadge = (classification: string) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

  switch (classification) {
    case "minimal_risk":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "limited_risk":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case "high_risk":
      return `${baseClasses} bg-red-100 text-red-800`;
    case "unacceptable_risk":
      return `${baseClasses} bg-red-100 text-red-800`;
    case "sector_specific":
      return `${baseClasses} bg-purple-100 text-purple-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};
