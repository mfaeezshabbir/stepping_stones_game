'use client'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader2, Crown, Timer } from 'lucide-react'

interface PlayerStatusProps {
  player: 1 | 2
  isCurrentPlayer: boolean
  isComputer: boolean
  isThinking: boolean
  timeLeft?: number
  timeLimit?: number
  position: 'left' | 'right'
}

export function PlayerStatus({ 
  player, 
  isCurrentPlayer, 
  isComputer, 
  isThinking, 
  timeLeft, 
  timeLimit, 
  position 
}: PlayerStatusProps) {
  const getPlayerColor = () => {
    return player === 1 ? 'bg-blue-500' : 'bg-red-500'
  }

  const getPlayerName = () => {
    if (player === 1) return 'Player 1'
    return isComputer ? 'Computer' : 'Player 2'
  }

  const getStatusIcon = () => {
    if (isThinking) {
      return <Loader2 className="w-4 h-4 animate-spin" />
    }
    if (isCurrentPlayer) {
      return <Crown className="w-4 h-4" />
    }
    return null
  }

  const getStatusText = () => {
    if (isThinking) return 'Computer is thinking...'
    if (isCurrentPlayer) return 'Your turn'
    return 'Waiting...'
  }

  const getTimeColor = () => {
    if (!timeLimit || !timeLeft) return ''
    const percentage = (timeLeft / timeLimit) * 100
    if (percentage <= 20) return 'text-red-500'
    if (percentage <= 50) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <TooltipProvider>
      <div className={`fixed top-20 ${position === 'left' ? 'left-4' : 'right-4'} z-30`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-3">
              {/* Player Card */}
              <div className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${isCurrentPlayer ? 'border-slate-400 dark:border-slate-600 shadow-lg scale-105' : 'border-transparent'}
                ${getPlayerColor()} bg-opacity-10 backdrop-blur-sm
              `}>
                {/* Current Player Indicator */}
                {isCurrentPlayer && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-yellow-900" />
                    </div>
                  </div>
                )}

                {/* Player Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${getPlayerColor()} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{player}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {getPlayerName()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      {getStatusIcon()}
                      <span>{isCurrentPlayer ? 'Active' : 'Waiting'}</span>
                    </div>
                  </div>
                </div>

                {/* Timer */}
                {timeLimit && timeLimit > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Timer className={`w-3 h-3 ${getTimeColor()}`} />
                      <span className={`text-xs font-mono ${getTimeColor()}`}>
                        {timeLeft}s
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <Badge 
                variant={isCurrentPlayer ? "default" : "secondary"} 
                className="w-full justify-center text-xs"
              >
                {isCurrentPlayer ? 'Current Turn' : 'Waiting'}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side={position === 'left' ? 'right' : 'left'}>
            <p className="text-sm font-medium">{getStatusText()}</p>
            {isComputer && isThinking && (
              <p className="text-xs text-slate-500">Analyzing best move...</p>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}