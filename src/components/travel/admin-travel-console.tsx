import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";
import { useLanguage } from "@/hooks/use-language";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import {
TrendingUp,
Package,
CalendarIcon,
Star,
Users,
DollarSign,
MapPin,
Clock,
Plus,
Edit,
Trash2,
Download,
Eye
} from "lucide-react";
import { PagesPage } from "@/dashboard/pages/PagesPage";
import { TagsPage } from "@/dashboard/pages/TagsPage";
const AdminTravelConsole: React.FC = () => {
const { user, isAdmin, loading: authLoading } = useAuth();
const { language } = useLanguage();
const [activeTab, setActiveTab] = useState("overview");
const [packages, setPackages] = useState([]);
const [extras, setExtras] = useState([]);
const [availability, setAvailability] = useState([]);
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [kpis, setKpis] = useState({
totalBookings: 0,
totalRevenue: 0,
topDestination: "",
bookingsThisMonth: 0,
});
const [showPackageDialog, setShowPackageDialog] = useState(false);
const [showExtraDialog, setShowExtraDialog] = useState(false);
const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
const [editingPackage, setEditingPackage] = useState(null);
const [editingExtra, setEditingExtra] = useState(null);
const [packageFilter, setPackageFilter] = useState("");
const [bookingFilter, setBookingFilter] = useState({
status: "",
dateRange: "",
search: "",
});
if (authLoading) return Loading authentication…;
if (!user) return ;
if (!isAdmin) return Access denied;
const fetchData = async () => {
try {
setLoading(true);
await Promise.all([
fetchPackages(),
fetchExtras(), // Keep this for future implementation
fetchAvailability(), // Keep this for future implementation
fetchBookings(),
calculateKPIs()
]);
} catch (error) {
console.error('Error fetching data:', error);
toast.error(language === 'es' ? 'Error al cargar datos' : 'Error loading data');
} finally {
setLoading(false);
}
};
const fetchPackages = async () => {
const { data, error } = await supabase
.from('travel_packages')
.select('*')
.order('created_at', { ascending: false });
if (error) throw error;
setPackages(data || []);
};
const fetchExtras = async () => {
// Implement actual fetching for extras here if they exist in Supabase
// For now, keep mock data if no Supabase table for extras
setExtras([]);
};
const fetchAvailability = async () => {
// Implement actual fetching for availability here if it exists in Supabase
// For now, keep mock data if no Supabase table for availability
setAvailability([]);
};
const fetchBookings = async () => {
const { data, error } = await supabase
.from('travel_bookings')
.select(`
*,
travel_packages (title, city, region)
`)
.order('created_at', { ascending: false });
if (error) throw error;
setBookings(data || []);
};
const calculateKPIs = async () => {
const { data: bookingStats, error } = await supabase
.from('travel_bookings')
.select('total_amount, travel_start_date, payment_status, travel_packages (city, region)');
if (error) throw error;
const totalBookings = bookingStats?.length || 0;
const totalRevenue = bookingStats?.reduce((sum, booking) =>
booking.payment_status === 'paid' ? sum + (booking.total_amount || 0) : sum, 0) || 0;
// Find top destination
const destinationCounts = bookingStats?.reduce((acc, booking) => {
const destination = booking.travel_packages?.city && booking.travel_packages?.region
? `${booking.travel_packages.city}, ${booking.travel_packages.region}`
: 'Unknown Destination'; // Handle cases where package data might be missing
acc[destination] = (acc[destination] || 0) + 1;
return acc;
}, {} as Record);
const topDestination = destinationCounts ?
Object.entries(destinationCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || '' : '';
// Bookings this month
const thisMonth = new Date();
thisMonth.setDate(1);
thisMonth.setHours(0, 0, 0, 0); // Normalize to start of month
const bookingsThisMonth = bookingStats?.filter(booking =>
booking.travel_start_date && new Date(booking.travel_start_date) >= thisMonth).length || 0;
setKpis({
totalBookings,
totalRevenue,
topDestination,
bookingsThisMonth
});
};
const exportBookingsCSV = () => {
const csvContent = [
['ID', 'Traveler', 'Email', 'Package', 'Date', 'Travelers', 'Amount', 'Status', 'Payment'].join(','),
...bookings.map(booking => [
booking.id,
booking.traveler_name,
booking.traveler_email,
booking.travel_packages?.title?.[language] || '',
booking.travel_start_date ? format(new Date(booking.travel_start_date), 'yyyy-MM-dd') : '',
booking.number_of_travelers,
booking.total_amount,
booking.booking_status,
booking.payment_status
].join(','))
].join('\n');
const blob = new Blob([csvContent], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `mexivanza-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
window.URL.revokeObjectURL(url);
};
const formatPrice = (amount: number) => {
return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
style: 'currency',
currency: 'MXN'
}).format(amount);
};
const getStatusColor = (status: string) => {
switch (status) {
case 'paid':
case 'confirmed':
return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'; // Using more generic success colors
case 'pending':
return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'; // Using more generic warning colors
case 'cancelled':
return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'; // Using more generic destructive colors
default:
return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'; // Muted
}
};
const filteredPackages = packages.filter(pkg =>
pkg.title?.[language]?.toLowerCase().includes(packageFilter.toLowerCase()) ||
pkg.city?.toLowerCase().includes(packageFilter.toLowerCase()) ||
pkg.region?.toLowerCase().includes(packageFilter.toLowerCase())
);
const filteredBookings = bookings.filter(booking => {
const matchesSearch = !bookingFilter.search ||
booking.traveler_name.toLowerCase().includes(bookingFilter.search.toLowerCase()) ||
booking.traveler_email.toLowerCase().includes(bookingFilter.search.toLowerCase());
const matchesStatus = !bookingFilter.status || bookingFilter.status === 'all' ||
booking.booking_status === bookingFilter.status ||
booking.payment_status === bookingFilter.status;
return matchesSearch && matchesStatus;
});
useEffect(() => {
fetchData();
}, []); // Empty dependency array to run once on mount
if (loading) {
return (
{[...Array(4)].map((_, i) => (
))}
);
}
return (
{/* Header */}
{language === 'es' ? 'Consola de Viajes' : 'Travel Console'}
{language === 'es' ? 'Gestión completa del sistema de viajes' : 'Complete travel system management'}
{language === 'es' ? 'Resumen' : 'Overview'}
{language === 'es' ? 'Paquetes' : 'Packages'}
{language === 'es' ? 'Disponibilidad' : 'Availability'}
{language === 'es' ? 'Extras' : 'Extras'}
{language === 'es' ? 'Reservas' : 'Bookings'}
{language === 'es' ? 'Páginas' : 'Pages'}
{language === 'es' ? 'Etiquetas' : 'Tags'}
{/* Overview Tab */}
{/* KPI Cards */}
{language === 'es' ? 'Reservas Totales' : 'Total Bookings'}
{kpis.totalBookings}
{language === 'es' ? 'Número total de reservas' : 'Total number of bookings'}
{language === 'es' ? 'Ingresos Totales' : 'Total Revenue'}
{formatPrice(kpis.totalRevenue)}
{language === 'es' ? 'Ingresos de reservas pagadas' : 'Revenue from paid bookings'}
{language === 'es' ? 'Destino Principal' : 'Top Destination'}
{kpis.topDestination || (language === 'es' ? 'N/A' : 'N/A')}
{language === 'es' ? 'Destino con más reservas' : 'Destination with most bookings'}
{language === 'es' ? 'Reservas este Mes' : 'Bookings This Month'}
{kpis.bookingsThisMonth}
{language === 'es' ? 'Nuevas reservas en el mes actual' : 'New bookings in current month'}
{/* Recent Bookings */}
{language === 'es' ? 'Reservas recientes' : 'Recent bookings'}
{bookings.slice(0, 5).map((booking) => (
{booking.traveler_name}
{booking.travel_packages?.title?.[language] || 'N/A'} • {format(new Date(booking.travel_start_date), 'MMM dd')}
{formatPrice(booking.total_amount)}
{booking.payment_status}
))}
{bookings.length === 0 && (
{language === 'es' ? 'No hay reservas recientes.' : 'No recent bookings.'}
)}
{/* Packages Tab */}
setPackageFilter(e.target.value)}
className="max-w-xs"
/>
{
setEditingPackage(null);
setShowPackageDialog(true);
}}>
{language === 'es' ? 'Nuevo paquete' : 'New package'}
{filteredPackages.map((pkg) => (
{pkg.gallery?.images?.[0]?.url && ( // Access url safely
)}
{pkg.featured && (
{language === 'es' ? 'Destacado' : 'Featured'}
)}
{pkg.title?.[language] || 'N/A'}
{pkg.is_published ? (language === 'es' ? 'Publicado' : 'Published') : (language === 'es' ? 'Borrador' : 'Draft')}
{pkg.city || 'N/A'}, {pkg.region || 'N/A'}
{pkg.duration || 'N/A'} {language === 'es' ? 'días' : 'days'}
{formatPrice(pkg.pricing_tiers?.standard?.price || 0)}
{
setEditingPackage(pkg);
setShowPackageDialog(true);
}}
>
{
// TODO: Implement delete package logic
toast.info(language === 'es' ? 'Funcionalidad de eliminar paquete próximamente.' : 'Delete package functionality coming soon.');
}}
>
))}
{filteredPackages.length === 0 && (
{language === 'es' ? 'No se encontraron paquetes.' : 'No packages found.'}
)}
{/* Availability Tab (Placeholder) */}
{language === 'es' ? 'Gestión de disponibilidad' : 'Availability management'}
{language === 'es' ? 'Próximamente' : 'Coming soon'}
{/* Extras Tab (Placeholder) */}
{language === 'es' ? 'Gestión de extras' : 'Extras management'}
{language === 'es' ? 'Próximamente' : 'Coming soon'}
{/* Bookings Tab */}
setBookingFilter(prev => ({ ...prev, search: e.target.value }))}
className="max-w-xs"
/>
setBookingFilter(prev => ({ ...prev, status: value }))}
>
{language === 'es' ? 'Todos' : 'All'}
{language === 'es' ? 'Pendiente' : 'Pending'}
{language === 'es' ? 'Confirmado' : 'Confirmed'}
{language === 'es' ? 'Pagado' : 'Paid'}
{language === 'es' ? 'Cancelado' : 'Cancelled'}
{language === 'es' ? 'Exportar CSV' : 'Export CSV'}
{language === 'es' ? 'Viajero' : 'Traveler'}
{language === 'es' ? 'Paquete' : 'Package'}
{language === 'es' ? 'Fecha' : 'Date'}
{language === 'es' ? 'Personas' : 'Travelers'}
{language === 'es' ? 'Total' : 'Total'}
{language === 'es' ? 'Estado' : 'Status'}
{language === 'es' ? 'Pago' : 'Payment'}
{language === 'es' ? 'Acciones' : 'Actions'}
{filteredBookings.length > 0 ? (
filteredBookings.map((booking) => (
{booking.traveler_name}
{booking.traveler_email}
{booking.travel_packages?.title?.[language] || 'N/A'}
{booking.travel_packages?.city || 'N/A'}, {booking.travel_packages?.region || 'N/A'}
{booking.travel_start_date ? format(new Date(booking.travel_start_date), 'MMM dd, yyyy') : 'N/A'}
{booking.number_of_travelers}
{formatPrice(booking.total_amount)}
{booking.booking_status}
{booking.payment_status}
{
// TODO: Implement view booking details logic
toast.info(language === 'es' ? 'Funcionalidad de ver reserva próximamente.' : 'View booking functionality coming soon.');
}}>
))
) : (
{language === 'es' ? 'No se encontraron reservas.' : 'No bookings found.'}
)}
{/* Pages Tab */}
{/* Tags Tab */}
{/* TODO: Add Dialog components for New Package, New Extra, New Availability */}
{/* Example for a Package Dialog (You'll need to create this component) */}
{/* {showPackageDialog && (
setShowPackageDialog(false)}
onSave={fetchPackages} // Re-fetch packages after save
/>
)} */}
);
};
export default AdminTravelConsole;
