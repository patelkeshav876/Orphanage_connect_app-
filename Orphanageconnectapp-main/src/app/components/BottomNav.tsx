import { Home, Heart, Calendar, User, ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '../lib/utils';

export function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Heart, label: 'Needs', path: '/needs' },
    { icon: ShoppingBag, label: 'Shop', path: '/earn-support' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary/70"
              )
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}