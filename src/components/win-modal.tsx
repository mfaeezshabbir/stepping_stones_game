'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, RotateCcw, Home } from 'lucide-react'

interface WinModalProps {
  isOpen: boolean
  winner: 0 | 1 | 2
  mode: 'friends' | 'computer'
  moveCount: number
  onPlayAgain: () => void
  onBackToMenu: () => void
}

export function WinModal({ isOpen, winner, mode, moveCount, onPlayAgain, onBackToMenu }: WinModalProps) {
  if (!isOpen) return null

  const getWinnerText = () => {
    if (winner === 0) return "It's a Draw!"
    if (winner === 1) return 'Player 1 Wins!'
    return mode === 'computer' ? 'Computer Wins!' : 'Player 2 Wins!'
  }

  const getWinnerColor = () => {
    if (winner === 0) return 'text-slate-600'
    if (winner === 1) return 'text-blue-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* Trophy Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className={`w-16 h-16 ${winner === 0 ? 'text-slate-400' : 'text-yellow-500'} animate-bounce`} />
              {winner !== 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
              )}
            </div>
          </div>

          {/* Winner Text */}
          <div className="space-y-2">
            <h2 className={`text-3xl font-bold ${getWinnerColor()}`}>
              {getWinnerText()}
            </h2>
            <div className="flex justify-center gap-2">
              {winner !== 0 && (
                <Badge variant="outline" className="text-sm">
                  {winner === 1 ? 'Blue' : mode === 'computer' ? 'CPU' : 'Red'} Player
                </Badge>
              )}
            </div>
          </div>

          {/* Game Stats */}
          <div className="space-y-2">
            <p className="text-slate-600 dark:text-slate-400">
              Game completed in <span className="font-bold">{moveCount}</span> moves
            </p>
            {winner !== 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {winner === 1 ? 'Blue' : mode === 'computer' ? 'Computer' : 'Red'} player dominated the board!
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={onPlayAgain}
              className="flex-1"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button 
              onClick={onBackToMenu}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}