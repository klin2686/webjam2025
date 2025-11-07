import { useEffect, useState } from "react";
import { storage, type MenuItem } from "../utils/api";

interface MenuUploadHistory {
  id: number;
  user_id: number;
  upload_name: string;
  created_at: string;
  analysis_result: MenuItem[];
}

interface MiniHistoryProps {
  onHistoryItemClick?: (items: MenuItem[]) => void;
  onSeeAllClick?: () => void;
}

const MiniHistory = ({ onHistoryItemClick, onSeeAllClick }: MiniHistoryProps) => {
  const [history, setHistory] = useState<MenuUploadHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const accessToken = storage.getAccessToken();
    if (!accessToken) {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_BASE_URL}/menu-uploads?limit=2`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const utcDateString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const date = new Date(utcDateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-black/40 text-sm font-sf-pro">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-600/60 text-sm font-sf-pro">Failed to load history</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-black/40 text-sm font-sf-pro">No recent uploads</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col gap-2">
      <div className="text-black/60 text-xs font-sf-pro font-semibold uppercase tracking-wide mb-1">
        Recent Uploads
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onHistoryItemClick?.(item.analysis_result)}
            className="w-full text-left p-3 rounded-lg bg-white/30 hover:bg-white/50 transition-all duration-200 border border-white/30 hover:border-white/60 group cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-black text-sm font-sf-pro font-medium truncate group-hover:text-black/80">
                  {item.upload_name}
                </div>
                <div className="text-black/50 text-xs font-sf-pro mt-1">
                  {item.analysis_result.length} items • {formatDate(item.created_at)}
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-black/30 group-hover:text-black/50 transition-colors"
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onSeeAllClick}
        className="w-full text-center py-2 text-black/50 hover:text-black/70 text-xs font-sf-pro transition-colors cursor-pointer"
      >
        See all
      </button>
    </div>
  );
};

export default MiniHistory;
