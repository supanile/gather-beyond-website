import { AdminLayout } from "@/components/admin/AdminLayout";
import { DiscordPushPage } from "@/components/admin/push-messages/DiscordPushPage";

export default function DiscordPushAdminPage() {
  return (
    <AdminLayout>
      <DiscordPushPage />
    </AdminLayout>
  );
}
