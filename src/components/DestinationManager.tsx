import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DestinationManager() {
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({ state: '', city: '', description: '' });

  useEffect(() => {
    fetchDestinations();
  }, []);

  async function fetchDestinations() {
    const { data, error } = await supabase.from('destinations').select('*');
    if (!error) setDestinations(data);
  }

  async function handleSubmit() {
    const { error } = await supabase.from('destinations').insert([form]);
    if (!error) {
      setForm({ state: '', city: '', description: '' });
      fetchDestinations();
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Destination Manager</h2>
      <div className="space-y-2">
        <Input placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
        <Input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        <Input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <Button onClick={handleSubmit}>Add Destination</Button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Existing Destinations</h3>
        <ul className="list-disc pl-5">
          {destinations.map(dest => (
            <li key={dest.id}>{dest.state} — {dest.city}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
