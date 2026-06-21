import type { AdminEvent } from '~/components/EventRow.vue'

/** Session-scoped admin events list — shared by the Events list and the draft wizard. */
export const useAdminEvents = () =>
  useState<AdminEvent[]>('admin-events', () => [
    { slug: 'vnl-cze-pol', title: 'CZE × POL — VNL Qualifier', venue: 'Královka Arena', city: 'Praha', day: '20', month: 'Jun', weekday: 'Sat', time: '19:00', status: 'published', sold: 1284, capacity: 3200, revenue: '391 080 Kč' },
    { slug: 'cup-final-four', title: 'Czech Cup — Final Four', venue: 'Ostravar Aréna', city: 'Ostrava', day: '27', month: 'Jun', weekday: 'Sat', time: '17:30', status: 'published', sold: 4800, capacity: 4800, revenue: '1 824 000 Kč' },
    { slug: 'u20-championship', title: 'U20 Youth Championship', venue: 'Hala Vodova', city: 'Brno', day: '12', month: 'Jul', weekday: 'Sun', time: '14:00', status: 'draft', note: 'Updated 2 days ago' },
    { slug: 'beach-open-smichov', title: 'Beach Volleyball Open', venue: 'Smíchovská pláž', city: 'Praha', day: '01', month: 'Aug', weekday: 'Sat', time: '10:00', status: 'draft', note: 'Updated 5 days ago' },
    { slug: 'cze-svk-friendly', title: 'CZE × SVK — Friendly', venue: 'Královka Arena', city: 'Praha', day: '15', month: 'May', weekday: 'Fri', time: '18:00', status: 'completed', sold: 2911, capacity: 3000, revenue: '873 300 Kč' },
    { slug: 'legends-night', title: 'Legends Night — Exhibition', venue: 'Tipsport Arena', city: 'Praha', day: '05', month: 'Jun', weekday: 'Fri', time: '20:00', status: 'cancelled', note: '118 tickets refunded' }
  ])
