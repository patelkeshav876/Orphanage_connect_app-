import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Plus, Search, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { mockNeeds } from '../../data/mock';
import { Link } from 'react-router';

export function ManageNeeds() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // In a real app, we would filter by the logged-in admin's ashramId
  const myNeeds = mockNeeds.filter(need => need.ashramId === 'ashram-1'); 

  const filteredNeeds = myNeeds.filter(need => 
    need.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-background sticky top-0 z-10 border-b p-4">
        <div className="flex items-center gap-4 mb-4">
           <Link to="/admin">
             <Button variant="ghost" size="icon" className="-ml-2">
               <ArrowLeft className="h-6 w-6" />
             </Button>
           </Link>
           <h1 className="text-xl font-bold">Manage Needs</h1>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search needs..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filteredNeeds.map(need => (
          <Card key={need.id} className="overflow-hidden border shadow-sm">
            <div className="flex h-24">
              <div className="w-24 h-full bg-gray-100 relative">
                 <img src={need.imageUrl} className="h-full w-full object-cover" alt={need.title} />
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm line-clamp-1">{need.title}</h3>
                      <Badge variant={need.urgency === 'high' ? 'destructive' : 'secondary'} className="text-[10px] h-5 px-1.5">
                        {need.urgency}
                      </Badge>
                   </div>
                   <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{need.category}</p>
                </div>
                
                <div className="flex justify-between items-end mt-2">
                   <div className="text-xs">
                     <span className="font-bold text-primary">{Math.round((need.quantityFulfilled/need.quantityRequired)*100)}%</span>
                     <span className="text-muted-foreground ml-1">funded</span>
                   </div>
                   <div className="flex gap-2">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                       <Edit2 className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filteredNeeds.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                <p>No needs found.</p>
            </div>
        )}
      </div>
    </div>
  );
}