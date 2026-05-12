// @/app/dashboard/layout.tsx (או הקובץ בו נמצא ה-Layout ששלחת)
import SideNav from '@/ui/dashboard/sidenav';
 
// @/app/dashboard/layout.tsx
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    // h-full משתמש ב-h-full של ה-body. overflow-hidden מונע גלילה חיצונית.
    <div className="flex h-full flex-col md:flex-row overflow-hidden bg-gray-50">
      <div className="w-full flex-none md:w-64 border-r border-gray-200 bg-white">
        <SideNav />
      </div>
      
      {/* זה האלמנט היחיד שצריך לגלול באפליקציה */}
      <main className="flex-grow overflow-y-auto">
        <div className="p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}