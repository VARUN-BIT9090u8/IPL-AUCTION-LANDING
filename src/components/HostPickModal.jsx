import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Zap } from 'lucide-react';
import { IPL_PLAYERS } from '../data/players';

const HostPickModal = ({ onClose, onPick, soldPlayerIds, currentPlayerId }) => {
  const [search, setSearch] = useState('');

  const availablePlayers = useMemo(() => {
    return IPL_PLAYERS.filter(p => 
      !soldPlayerIds.has(p.id) && 
      p.id !== currentPlayerId &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.role.toLowerCase().includes(search.toLowerCase()))
    ).slice(0, 50);
  }, [search, soldPlayerIds, currentPlayerId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Zap className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Pick Next Player</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />
        </div>

        <div className="space-y-2">
          {availablePlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => {
                onPick(player);
                onClose();
              }}
              className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-white">{player.name}</p>
                <p className="text-sm text-gray-400">{player.role}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl">
                  {player.tier === 1 ? '👑' : player.tier === 2 ? '🔥' : '📈'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HostPickModal;