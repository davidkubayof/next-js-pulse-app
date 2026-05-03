import { auth } from '../../../auth';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { CreateTask } from '../tasks/buttons';
import Image from 'next/image';

export default async function Header() {
  const session = await auth();
  if (!session?.user) return null;
  const { name, email, image } = session.user;

  return (
    <div className="flex items-center gap-4">
      <CreateTask />
      {/* מפריד קטן */}
      <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden sm:block" />

      {/* פרטי משתמש */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right leading-tight">
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-[10px] text-gray-500">{email}</p>
        </div>

        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-50 flex-shrink-0">
          {image ? (
            <Image
              src={image}
              alt="Profile"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserCircleIcon className="h-full w-full text-gray-300" />
          )}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        </div>
      </div>
    </div>
  );
}