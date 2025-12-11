// src/components/StatusBadge.tsx

interface StatusBadgeProps {
  status: 'available' | 'occupied' | 'needsAiring' | 'online' | 'offline';
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          label: 'Disponible',
          bg: 'bg-[#00C853]',
          text: 'text-white'
        };
      case 'occupied':
        return {
          label: 'Occupée',
          bg: 'bg-[#D50000]',
          text: 'text-white'
        };
      case 'needsAiring':
        return {
          label: 'À aérer',
          bg: 'bg-[#FF8F00]',
          text: 'text-white'
        };
      case 'online':
        return {
          label: 'En ligne',
          bg: 'bg-[#00C853]',
          text: 'text-white'
        };
      case 'offline':
        return {
          label: 'Hors ligne',
          bg: 'bg-[#9E9E9E]',
          text: 'text-white'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2'
  };

  return (
    <span className={`inline-flex items-center rounded-full ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5"></span>
      {config.label}
    </span>
  );
}