import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, Download, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockAshrams } from '../data/mock';
import { useUser } from '../context/UserContext';
import { api } from '../lib/api';
import { Donation } from '../types';

export function DonationHistory() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadDonations();
    }
  }, [currentUser]);

  const loadDonations = async () => {
    try {
      const data = await api.getDonations(currentUser?.id);
      setDonations(data);
    } catch (error) {
      // Silently fall back to empty array
    } finally {
      setLoading(false);
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-background sticky top-0 z-10 border-b p-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" className="-ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Donation History</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Donated</p>
              <h2 className="text-3xl font-bold text-primary">
                {loading ? '...' : `₹${totalDonated.toLocaleString()}`}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '...' : donations.length}
                </p>
                <p className="text-xs text-muted-foreground">Donations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '...' : new Set(donations.map(d => d.ashramId)).size}
                </p>
                <p className="text-xs text-muted-foreground">Ashrams Supported</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donation List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Recent Donations</h3>
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>

          {loading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading donations...
            </div>
          )}

          {!loading && donations.map((donation) => {
            const ashram = mockAshrams.find(a => a.id === donation.ashramId);
            if (!ashram) return null;

            return (
              <Card key={donation.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(donation.status)}
                        <h4 className="font-semibold text-sm">{ashram.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">General Donation</p>
                    </div>
                    {getStatusBadge(donation.status)}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <p className="text-xl font-bold text-primary">₹{donation.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(donation.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!loading && donations.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-2">No donation history yet.</p>
            <p className="text-sm">Start making a difference today!</p>
          </div>
        )}
      </div>
    </div>
  );
}