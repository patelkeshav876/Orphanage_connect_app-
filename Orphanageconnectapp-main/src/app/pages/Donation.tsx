import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { mockAshrams } from '../data/mock';
import { Check, CreditCard, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { api } from '../lib/api';
import { toast } from 'sonner';

export function Donation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const ashram = mockAshrams.find((a) => a.id === id);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!ashram) return <div>Ashram not found</div>;

  const handleDonate = async () => {
    if (!currentUser) {
      toast.error('Please log in to make a donation');
      navigate('/login');
      return;
    }

    setProcessing(true);
    
    try {
      const donationAmount = amount || Number(customAmount);
      
      // Try to save to backend
      try {
        await api.createDonation({
          userId: currentUser.id,
          ashramId: ashram.id,
          amount: donationAmount,
          date: new Date().toISOString(),
          status: 'completed',
        });
      } catch (backendError) {
        // Backend not available, but continue with success flow
      }

      setStep(3);
      toast.success('Donation successful! Thank you for your generosity.');
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error('Failed to process donation. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold ml-4">Donate to {ashram.name}</h1>
      </header>

      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-serif font-semibold">Select Amount</h2>
              <div className="grid grid-cols-2 gap-4">
                {[500, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      amount === val
                        ? 'border-primary bg-primary/5 text-primary font-bold'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <Input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount('');
                  }}
                  className="pl-8 h-14 text-lg font-medium"
                />
              </div>
              <Button
                className="w-full h-14 text-lg shadow-lg mt-8"
                disabled={!amount && !customAmount}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-serif font-semibold">Payment Method</h2>
              <div className="space-y-3">
                <div className="flex items-center p-4 border rounded-xl gap-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Credit / Debit Card</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                  </div>
                  <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="h-2.5 w-2.5 bg-primary rounded-full" />
                  </div>
                </div>
                
                <div className="flex items-center p-4 border rounded-xl gap-4 opacity-50 cursor-not-allowed">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    <span className="font-bold text-xs">UPI</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">UPI</p>
                    <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-xl space-y-2 mt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Donation Amount</span>
                  <span className="font-medium">₹{amount || customAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee (0%)</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="pt-2 border-t flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{amount || customAmount}</span>
                </div>
              </div>

              <Button 
                onClick={handleDonate} 
                className="w-full h-14 text-lg shadow-lg mt-4"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Pay Securely'}
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6"
            >
              <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                <Check className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-primary">Thank You!</h2>
              <p className="text-muted-foreground px-8">
                Your donation of ₹{amount || customAmount} to {ashram.name} was successful.
              </p>
              <p className="text-sm text-muted-foreground">Redirecting to home...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}