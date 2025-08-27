import { UserServerChecker } from "@/components/admin/UserServerChecker";

export default function CheckUserPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User Server Checker</h1>
        <p className="text-muted-foreground mt-2">
          เช็คว่า user ใน Grist อยู่ใน Discord server ไหนบ้าง
        </p>
      </div>
      <UserServerChecker />
    </div>
  );
}
