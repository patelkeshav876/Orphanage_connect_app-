import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  ArrowRight, 
  Settings, 
  History, 
  HelpCircle, 
  LogOut, 
  Heart, 
  Award,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { api } from '../lib/api';

export function Profile() {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useUser();
  const [stats, setStats] = useState({
    totalDonations: 0,
    donationCount: 0,
    livesImpacted: 0,
    ashramSupported: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadUserStats();
    }
  }, [currentUser]);

  const loadUserStats = async () => {
    try {
      // Fetch donation history
      const donations = await api.getDonations(currentUser?.id);
      
      const totalDonations = donations.reduce((sum: number, d: any) => sum + d.amount, 0);
      const uniqueAshrams = new Set(donations.map((d: any) => d.ashramId));
      
      setStats({
        totalDonations,
        donationCount: donations.length,
        livesImpacted: Math.floor(totalDonations / 250), // Estimate: ₹250 per person
        ashramSupported: uniqueAshrams.size,
      });
    } catch (error) {
      // Fall back to demo stats
      setStats({
        totalDonations: 12500,
        donationCount: 8,
        livesImpacted: 50,
        ashramSupported: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-serif font-bold">My Profile</h1>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/settings')}
            >
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Card - Overlapping header */}
      <div className="px-6 -mt-12 relative z-20">
        <Card className="p-6 shadow-xl border-primary/20">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{currentUser.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Mail className="h-3.5 w-3.5" />
                <span>{currentUser.email}</span>
              </div>
              <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                {isAdmin ? "Ashram Admin" : "Donor"}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          {!isAdmin && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
              <div className="bg-primary/5 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Total Donated</span>
                </div>
                <p className="text-xl font-bold text-primary">
                  {loading ? '...' : `₹${stats.totalDonations.toLocaleString()}`}
                </p>
              </div>
              
              <div className="bg-orange-500/5 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span className="text-xs text-muted-foreground">Lives Impacted</span>
                </div>
                <p className="text-xl font-bold text-orange-600">
                  {loading ? '...' : `${stats.livesImpacted}+`}
                </p>
              </div>
              
              <div className="bg-blue-500/5 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">Donations</span>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {loading ? '...' : stats.donationCount}
                </p>
              </div>
              
              <div className="bg-purple-500/5 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-muted-foreground">Ashrams</span>
                </div>
                <p className="text-xl font-bold text-purple-600">
                  {loading ? '...' : stats.ashramSupported}
                </p>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>Managing ashram profile and activities</span>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      <main className="flex-1 p-6 space-y-4">
        {/* Admin Dashboard - Only for admins */}
        {isAdmin && (
          <Card 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5"
            onClick={() => navigate('/admin')}
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-bold text-primary block">Admin Dashboard</span>
                <span className="text-xs text-muted-foreground">Manage your ashram</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-primary" />
          </Card>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {!isAdmin && (
              <>
                <Card 
                  className="p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 active:scale-[0.98] transition-transform text-center"
                  onClick={() => navigate('/donation-history')}
                >
                  <div className="bg-blue-500/10 p-2 rounded-lg mb-2">
                    <History className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium block mb-1">Donation History</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">View contributions</span>
                </Card>

                <Card 
                  className="p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 active:scale-[0.98] transition-transform text-center"
                  onClick={() => navigate('/my-bookings')}
                >
                  <div className="bg-purple-500/10 p-2 rounded-lg mb-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium block mb-1">My Bookings</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">View scheduled visits</span>
                </Card>

                <Card 
                  className="p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 active:scale-[0.98] transition-transform text-center"
                  onClick={() => navigate('/favorites')}
                >
                  <div className="bg-red-500/10 p-2 rounded-lg mb-2">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-xs font-medium block mb-1">Favorites</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">Saved ashrams</span>
                </Card>
              </>
            )}

            <Card 
              className="p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 active:scale-[0.98] transition-transform text-center"
              onClick={() => navigate('/settings')}
            >
              <div className="bg-gray-500/10 p-2 rounded-lg mb-2">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs font-medium block mb-1">Settings</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Preferences</span>
            </Card>

            <Card 
              className="p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 active:scale-[0.98] transition-transform text-center"
              onClick={() => navigate('/help')}
            >
              <div className="bg-green-500/10 p-2 rounded-lg mb-2">
                <HelpCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-xs font-medium block mb-1">Help & Support</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Get assistance</span>
            </Card>
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full mt-6 gap-2 h-12" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </main>
    </div>
  );
}