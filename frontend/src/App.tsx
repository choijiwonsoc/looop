import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { EventsListPage } from './pages/EventsListPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { JoinEventPage } from './pages/JoinEventPage';
import { getIdentity, setIdentityName } from './identity';
import { IdentityModal } from './components/IdentityModal';

export default function App() {
  const location = useLocation();
  const [identity, setIdentity] = useState(getIdentity());

  // /join/:code prompts for a name itself — don't double up here.
  const onJoinRoute = location.pathname.startsWith('/join/');
  const needsName = identity.name === 'You' && !onJoinRoute;

  function handleSaveName(name: string) {
    setIdentity(setIdentityName(name));
  }
  return (
    <>
      <Navbar />
      {needsName && <IdentityModal onSave={handleSaveName} />}
      <Routes>
        <Route path="/" element={<EventsListPage />} />
        <Route path="/new" element={<CreateEventPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/join/:code" element={<JoinEventPage />} />
      </Routes>
    </>
  );
}
