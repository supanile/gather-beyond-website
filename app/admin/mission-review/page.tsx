"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { MissionReviewPage } from "@/components/admin/mission-review/MissionReviewPage";

export default function MissionReviewPageRoute() {
  return (
    <AdminLayout>
      <MissionReviewPage />
    </AdminLayout>
  );
}
