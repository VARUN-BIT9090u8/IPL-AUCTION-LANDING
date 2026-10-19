import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// True on laptop/tablet (768px and up), false on mobile.
// Used so the photo is not rendered at all on mobile.
const useIsDesktop = () => {
  const query = '(min-width: 768px)';
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
};

const fmt2 = (v) => (typeof v === 'number' ? v.toFixed(2) : '-');
const fmt0 = (v) => (typeof v === 'number' ? v : '-');

const Stat = ({ label, value, color }) => (
  <div className="text-center">
    <span className="block text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest  mb-0.5 truncate">
      {label}
    </span>
     <span className={`text-sm sm:text-base md:text-lg font-bold ${color}`}>{value}</span>
  </div>
);

const GameCard = ({ card, onClick, interactive = false, selected = false }) => {
  const isDesktop = useIsDesktop();
  if (!card) return null;

  const s = card.stats || {};
  const Wrapper = interactive ? motion.button : motion.div;

  return (
     <Wrapper
      type={interactive ? 'button' : undefined}
      onClick={interactive ? onClick : undefined}
      whileHover={interactive ? { y: -4 } : undefined}
      className={`w-full min-w-0 text-left flex flex-col bg-gradient-to-b from-[#161616] to-[#0f0f0f] border rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)] transition-colors ${
        selected ? 'border-yellow-500' : 'border-white/[0.08]'
      } ${interactive ? 'hover:border-yellow-500/50 cursor-pointer' : ''}`}
    >
      {/* Photo: laptop/tablet only. Not rendered on mobile. */}
      {isDesktop && card.image && (
        <div className="w-full aspect-[4/5] bg-gradient-to-b from-white/10 to-transparent overflow-hidden border-b border-white/10">
          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-3 flex flex-col gap-2.5 flex-1">
        <div>
          <div className="flex flex-wrap gap-1 mb-1.5">
            <span className="bg-blue-500/10 border border-blue-500/20 text-yellow-500 text-[7px] sm:text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              {card.role}
            </span>
            <span className="bg-purple-500/10 border border-purple-500/20 text-blue-400 text-[7px] sm:text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              {card.country === 'IND' ? 'Indian' : 'Overseas'}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-black uppercase tracking-tight leading-tight break-words">
            {card.name}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-x-1 gap-y-2 bg-white/[0.02] p-2 rounded-xl border border-white/[0.04]">
          <Stat label="Runs" value={fmt0(s.runs)} color="text-yellow-500" />
          <Stat label="S.Rate" value={fmt2(s.sr)} color="text-gray-100" />
          <Stat label="Wkts" value={fmt0(s.wickets)} color="text-green-500" />
          <Stat label="Avg" value={fmt2(s.avg)} color="text-gray-100" />
          <Stat label="Econ" value={fmt2(s.econ)} color="text-red-400" />
        </div>

        {card.draftedPrice != null && (
          <div className="mt-auto flex flex-col items-center bg-black/20 border border-white/5 rounded-lg px-2 py-1.5">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-wider">Drafted for</span>
            <span className="text-sm font-black text-yellow-500">
              ₹{Number(card.draftedPrice).toFixed(2)} Cr
            </span>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default GameCard;