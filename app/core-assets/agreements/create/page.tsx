"use client";

import CreateAgreementWizard from "@/components/app/agreements/create/CreateAgreementWizard";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function Page() {
    return (
        <PermissionPage permission={PERMISSIONS.AGREEMENTS_CREATE}>
            <CreateAgreementWizard />
        </PermissionPage>
    );
}


