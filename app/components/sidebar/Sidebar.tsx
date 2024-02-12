import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar from "./DesktopSidebar";
import MobildFootbar from "./MobileFooter";

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      {/*デスクトップ用サイドバー*/}
      <DesktopSidebar currentUser={currentUser!} />
      {/*モバイル端末用フッター*/}
      <MobildFootbar />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Sidebar;
