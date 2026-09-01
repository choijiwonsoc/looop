import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { EventsListPage } from './pages/EventsListPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { EventDetailPage } from './pages/EventDetailPage';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<EventsListPage />} />
        <Route path="/new" element={<CreateEventPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
      </Routes>
    </>
  );
}
