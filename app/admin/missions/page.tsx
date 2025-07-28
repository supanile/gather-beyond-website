import AdminMissionsTable from "@/components/admin/AdminMissionsTable";
import { AdminLayout } from "@/components/admin/AdminLayout";

const MissionsPage = () => {
  return (
    <AdminLayout>
      <AdminMissionsTable />
    </AdminLayout>
  );
};

export default MissionsPage;