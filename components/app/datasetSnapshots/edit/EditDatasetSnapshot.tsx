"use client";

import React from "react";
import EditDatasetSnapshotWizard from "./EditDatasetSnapshotWizard";

interface EditDatasetSnapshotProps {
  snapshotId: number;
}

const EditDatasetSnapshot: React.FC<EditDatasetSnapshotProps> = ({ snapshotId }) => {
  return <EditDatasetSnapshotWizard snapshotId={snapshotId} />;
};

export default EditDatasetSnapshot;


