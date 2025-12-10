// src/components/RoomRedirect.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockRooms } from '../data/mockData';

interface RoomRedirectProps {
  isAuthenticated: boolean;
  userRole: 'student' | 'admin' | null;
  onSetRedirect: (path: string) => void;
}

export default function RoomRedirect({ isAuthenticated, userRole, onSetRedirect }: RoomRedirectProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) {
      navigate('/login');
      return;
    }

    // Vérifier que la salle existe
    const room = mockRooms.find(r => r.id === roomId);
    if (!room) {
      navigate('/login');
      return;
    }

    if (!isAuthenticated) {
      // Stocker le chemin pour redirection après connexion
      onSetRedirect(`/room/${roomId}`);
      navigate('/login');
    } else {
      // Rediriger selon le rôle
      if (userRole === 'admin') {
        // Admin → configuration du module
        navigate(`/admin/modules/${room.moduleId}`);
      } else if (userRole === 'student') {
        // Étudiant → détails de la salle
        navigate(`/student/room/${roomId}`);
      }
    }
  }, [roomId, isAuthenticated, userRole, navigate, onSetRedirect]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0092bd] mx-auto"></div>
        <p className="mt-4 text-[#5F6368]">Redirection en cours...</p>
      </div>
    </div>
  );
}
