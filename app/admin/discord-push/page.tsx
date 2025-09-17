import { AdminLayout } from "@/components/admin/AdminLayout";
import { DiscordPushPage } from "@/components/admin/discord-push/DiscordPushPage";

export default function DiscordPushAdminPage() {
  return (
    <AdminLayout>
      <DiscordPushPage />
    </AdminLayout>
  );
}
