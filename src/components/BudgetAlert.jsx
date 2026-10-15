import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const BudgetAlert = ({ team, auction }) => {
  const [expanded, setExpanded] = useState(false);

  if (!team || !auction) return null;

  const totalBudget = auction?.settings?.budget || 120;
  const spent = team.spent || 0;
  const remaining = team.budgetRemaining || totalBudget;
  const spentPercent = (spent / totalBudget) * 100;
  
  const squadLimit = auction?.squadLimit || 25;
  const playersLeft = squadLimit - (team.squad?.length || 0);
  const avgNeeded = playersLeft > 0 ? (remaining / playersLeft).toFixed(2) : 0;

  // Determine color
  let alertColor = 'from-green-500 to-green-600';
  let textColor = 'text-green-400';
  let bgAlert = 'bg-green-500/10 border-green-500/30';
  let alertText = '✅ Safe';
  
  if (remaining <= 5) {
    alertColor = 'from-red-500 to-red-600';
    textColor = 'text-red-400';
    bgAlert = 'bg-red-500/10 border-red-500/30';
    alertText = '🔴 CRITICAL';
  } else if (remaining <= 20) {
    alertColor = 'from-orange-500 to-orange-600';
    textColor = 'text-orange-400';
    bgAlert = 'bg-orange-500/10 border-orange-500/30';
    alertText = '⚠️ WARNING';
  } else if (remaining <= 40) {
    alertColor = 'from-yellow-500 to-yellow-600';
    textColor = 'text-yellow-400';
    bgAlert = 'bg-yellow-500/10 border-yellow-500/30';
    alertText = '🟡 Caution';
  }

  return (
    <div className="">
      {/* COMPACT TOP BAR - Always Visible */}
      <div className="px-4 lg:px-6 py-2 lg:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Left: Main Info */}
          <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
            <div className="flex-1">
              <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase">Budget</p>
              <p className={`text-sm lg:text-lg font-black ${textColor} truncate`}>
                ₹{remaining.toFixed(1)} Cr Left
              </p>
            </div>

            {/* Divider - Hide on mobile */}
            <div className="hidden sm:block h-8 w-px bg-slate-600"></div>

            {/* Middle: Progress - Hide on small mobile */}
            <div className="hidden sm:flex flex-col gap-1 flex-1">
              <p className="text-[10px] lg:text-xs font-bold text-gray-400">Used</p>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className={`h-full bg-gradient-to-r ${alertColor} rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min(spentPercent, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Divider - Hide on mobile */}
            <div className="hidden sm:block h-8 w-px bg-slate-600"></div>

            {/* Right: Stats - Hide on mobile */}
            <div className="hidden sm:flex items-center gap-3 flex-1">
              <div>
                <p className="text-[10px] lg:text-xs font-bold text-gray-400">Players</p>
                <p className="text-sm lg:text-base font-bold text-blue-400">{playersLeft}/{squadLimit}</p>
              </div>
              <div>
                <p className="text-[10px] lg:text-xs font-bold text-gray-400">Avg</p>
                <p className="text-sm lg:text-base font-bold text-purple-400">₹{avgNeeded}</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-2 lg:px-3 py-1 rounded font-bold text-xs lg:text-sm flex-shrink-0 ${bgAlert} border`}>
            {alertText}
          </div>

          {/* Expand Button - Mobile only */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="sm:hidden p-1 hover:bg-slate-700 rounded transition-all"
          >
            <ChevronDown 
              size={18} 
              className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* EXPANDED DETAILS - Mobile Only */}
        {expanded && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Spent:</span>
              <span className="font-bold text-white">₹{spent.toFixed(1)} / ₹{totalBudget}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Used:</span>
              <span className="font-bold text-white">{spentPercent.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Players Left:</span>
              <span className="font-bold text-blue-400">{playersLeft} / {squadLimit}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Avg Per Player:</span>
              <span className="font-bold text-purple-400">₹{avgNeeded}</span>
            </div>

            {/* Warning on Mobile */}
            {remaining <= 40 && (
              <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <p className="text-[10px] font-bold text-yellow-400">
                  {remaining <= 5 
                    ? `⚠️ Only ₹${remaining.toFixed(1)} Cr! Plan carefully.`
                    : remaining <= 20
                    ? `⚠️ Only ₹${remaining.toFixed(1)} Cr left!`
                    : `💡 Avg ₹${avgNeeded} Cr needed per player`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetAlert;