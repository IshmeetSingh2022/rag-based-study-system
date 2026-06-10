import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/',      icon: '◈', label: 'Dashboard' },
  { to: '/chat',  icon: '◎', label: 'Chat'      },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-gray-200 flex flex-col z-50">

   
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
            SB
          </div>
          <span className="font-semibold text-sm text-gray-800">StudyBuddy AI</span>
        </div>
      </div>

      
      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-gray-400 text-xs mb-0.5">Signed in as</p>
        <p className="text-sm text-gray-800 font-medium truncate">{user?.username}</p>
      </div>


      <nav className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full
               ${isActive
                 ? 'bg-purple-50 text-purple-600 font-semibold'
                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`
            }
          >
            <span className="text-base leading-none">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full px-4 py-2 rounded-lg text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
        >
          ← Logout
        </button>
      </div>

    </aside>
  )
}