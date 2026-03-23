import { Link } from 'react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Plus, 
  Users, 
  Gift, 
  Calendar, 
  Settings as SettingsIcon, 
  MessageSquare,
  Store,
  Package,
  TrendingUp,
  Home,
  Heart,
  IndianRupee
} from 'lucide-react';
import { mockNeeds, mockAshrams } from '../../data/mock';

export function AdminDashboard() {
  const ashram = mockAshrams[0]; // Single ashram

  const stats = [
    { label: 'Total Donations', value: '₹1.2L', icon: IndianRupee, color: 'bg-green-100 text-green-600' },
    { label: 'This Month', value: '₹12.5k', icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Needs', value: '8', icon: Gift, color: 'bg-orange-100 text-orange-600' },
    { label: 'Total Donors', value: '142', icon: Users, color: 'bg-purple-100 text-purple-600' },
  ];

  const quickActions = [
    { label: 'Manage Needs', icon: Gift, color: 'bg-blue-100 text-blue-600', link: '/admin/needs' },
    { label: 'Events', icon: Calendar, color: 'bg-purple-100 text-purple-600', link: '/admin/events' },
    { label: 'Feed Posts', icon: MessageSquare, color: 'bg-green-100 text-green-600', link: '/admin/feed' },
    { label: 'Profile', icon: Home, color: 'bg-orange-100 text-orange-600', link: '/profile' },
    { label: 'Vendors', icon: Store, color: 'bg-pink-100 text-pink-600', link: '/admin/vendors' },
    { label: 'Products', icon: Package, color: 'bg-teal-100 text-teal-600', link: '/admin/products' },
  ];

  const recentActivities = [
    {
      type: 'donation',
      icon: Heart,
      title: 'New donation received',
      description: 'Ravi Kumar donated ₹500 for "Monthly Groceries"',
      time: '2 hours ago',
      color: 'bg-green-500/10 text-green-600'
    },
    {
      type: 'event',
      icon: Calendar,
      title: 'Event booking',
      description: 'Priya Sharma registered for "Children Day Celebration"',
      time: '4 hours ago',
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      type: 'vendor',
      icon: Store,
      title: 'New vendor registration',
      description: 'Traditional Handicrafts submitted application',
      time: '6 hours ago',
      color: 'bg-orange-500/10 text-orange-600'
    },
    {
      type: 'need',
      icon: Gift,
      title: 'Need fulfilled',
      description: '"School Uniforms" need has been 100% fulfilled',
      time: '1 day ago',
      color: 'bg-blue-500/10 text-blue-600'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 p-6 pb-8 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-white/80">{ashram.name}</p>
          </div>
          <Link to="/admin/settings">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20 text-white">
              <SettingsIcon className="h-6 w-6" />
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-none shadow-md bg-white/95">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="p-6 -mt-4">
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Quick Actions</h2>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Super Admin
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-8">
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.link}>
              <Card className="hover:bg-muted/50 active:scale-95 transition-all cursor-pointer border-none shadow-sm h-full">
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-center">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, idx) => (
            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{activity.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Create */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link to="/admin/needs/create">
            <Button className="w-full h-12 gap-2" variant="default">
              <Plus className="h-4 w-4" />
              Add Need
            </Button>
          </Link>
          <Link to="/admin/events/create">
            <Button className="w-full h-12 gap-2" variant="outline">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}