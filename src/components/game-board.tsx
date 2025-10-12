'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { WinModal } from '@/components/win-modal'
import { PlayerStatus } from '@/components/player-status'

export type GameSettings = {
  boardSize: number
  winCondition: number
  computerDifficulty: 'easy' | 'medium' | 'hard'
  enablePowerUps: boolean
  timeLimit: number
  theme: 'classic' | 'neon' | 'nature'
}

type Player = 1 | 2
type Cell = 0 | Player
type PowerUp = 'bomb' | 'shield' | 'swap' | null

interface GameState {
  board: Cell[][]
  currentPlayer: Player
  winner: Player | null
  gameOver: boolean
  moveHistory: { row: number; col: number; player: Player }[]
  powerUps: PowerUp[]
  timeLeft: number
  playerPowerUps: { [key in Player]: PowerUp[] }
}

interface GameBoardProps {
  mode: 'friends' | 'computer'
  settings: GameSettings
  onGameEnd: () => void
}

const themeStyles = {
  classic: {
    player1: 'bg-blue-500 hover:bg-blue-600',
    player2: 'bg-red-500 hover:bg-red-600',
    board: 'bg-slate-100 dark:bg-slate-800',
    cell: 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600'
  },
  neon: {
    player1: 'bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/50',
    player2: 'bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/50',
    board: 'bg-purple-950',
    cell: 'bg-purple-900 hover:bg-purple-800 border border-purple-700'
  },
  nature: {
    player1: 'bg-green-600 hover:bg-green-700',
    player2: 'bg-orange-600 hover:bg-orange-700',
    board: 'bg-amber-50 dark:bg-amber-950',
    cell: 'bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800'
  }
}

export function GameBoard({ mode, settings, onGameEnd }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: Array(settings.boardSize).fill(null).map(() => Array(settings.boardSize).fill(0)),
    currentPlayer: 1,
    winner: null,
    gameOver: false,
    moveHistory: [],
    powerUps: settings.enablePowerUps ? generatePowerUps(settings.boardSize) : [],
    timeLeft: settings.timeLimit,
    playerPowerUps: { 1: [], 2: [] }
  }))

  const [isThinking, setIsThinking] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)

  function generatePowerUps(boardSize: number): PowerUp[] {
    const powerUps: PowerUp[] = []
    const count = Math.floor(boardSize * boardSize * 0.1)
    for (let i = 0; i < count; i++) {
      const types: PowerUp[] = ['bomb', 'shield', 'swap']
      powerUps.push(types[Math.floor(Math.random() * types.length)])
    }
    return powerUps
  }

  const checkWinner = useCallback((board: Cell[][], row: number, col: number, player: Player): boolean => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ]

    for (const [dx, dy] of directions) {
      let count = 1
      
      // Check positive direction
      for (let i = 1; i < settings.winCondition; i++) {
        const newRow = row + dx * i
        const newCol = col + dy * i
        if (newRow >= 0 && newRow < settings.boardSize && 
            newCol >= 0 && newCol < settings.boardSize && 
            board[newRow][newCol] === player) {
          count++
        } else break
      }
      
      // Check negative direction
      for (let i = 1; i < settings.winCondition; i++) {
        const newRow = row - dx * i
        const newCol = col - dy * i
        if (newRow >= 0 && newRow < settings.boardSize && 
            newCol >= 0 && newCol < settings.boardSize && 
            board[newRow][newCol] === player) {
          count++
        } else break
      }
      
      if (count >= settings.winCondition) return true
    }
    
    return false
  }, [settings.boardSize, settings.winCondition])

  const checkBoardFull = useCallback((board: Cell[][]): boolean => {
    return board.every(row => row.every(cell => cell !== 0))
  }, [])

  const makeMove = useCallback((row: number, col: number) => {
    if (gameState.gameOver || gameState.board[row][col] !== 0 || isThinking) return

    const newBoard = gameState.board.map(r => [...r])
    newBoard[row][col] = gameState.currentPlayer
    
    const hasWon = checkWinner(newBoard, row, col, gameState.currentPlayer)
    const isDraw = !hasWon && checkBoardFull(newBoard)
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
      winner: hasWon ? prev.currentPlayer : isDraw ? 0 : null,
      gameOver: hasWon || isDraw,
      moveHistory: [...prev.moveHistory, { row, col, player: prev.currentPlayer }]
    }))

    if (hasWon) {
      const winnerName = gameState.currentPlayer === 1 ? 'Player 1' : (mode === 'computer' ? 'Computer' : 'Player 2')
      toast.success(`${winnerName} wins!`)
    } else if (isDraw) {
      toast("It's a draw!")
    }
  }, [gameState, isThinking, checkWinner, checkBoardFull, mode])

  const computerMove = useCallback(() => {
    if (gameState.gameOver || gameState.currentPlayer !== 2) return

    setIsThinking(true)
    
    setTimeout(() => {
      const availableMoves: { row: number; col: number; score: number }[] = []
      
      for (let row = 0; row < settings.boardSize; row++) {
        for (let col = 0; col < settings.boardSize; col++) {
          if (gameState.board[row][col] === 0) {
            let score = Math.random() * 10
            
            // Check if computer can win
            const testBoardWin = gameState.board.map(r => [...r])
            testBoardWin[row][col] = 2
            if (checkWinner(testBoardWin, row, col, 2)) {
              score += 10000
            }
            
            // Check if need to block player
            const testBoardBlock = gameState.board.map(r => [...r])
            testBoardBlock[row][col] = 1
            if (checkWinner(testBoardBlock, row, col, 1)) {
              score += 5000
            }
            
            // Medium and hard difficulty strategies
            if (settings.computerDifficulty === 'medium' || settings.computerDifficulty === 'hard') {
              // Check for creating potential wins
              for (let checkRow = 0; checkRow < settings.boardSize; checkRow++) {
                for (let checkCol = 0; checkCol < settings.boardSize; checkCol++) {
                  if (testBoardWin[checkRow][checkCol] === 0) {
                    testBoardWin[checkRow][checkCol] = 2
                    if (checkWinner(testBoardWin, checkRow, checkCol, 2)) {
                      score += 100
                    }
                    testBoardWin[checkRow][checkCol] = 0
                  }
                }
              }
            }
            
            // Hard difficulty specific strategies
            if (settings.computerDifficulty === 'hard') {
              // Prefer center positions
              const centerRow = Math.floor(settings.boardSize / 2)
              const centerCol = Math.floor(settings.boardSize / 2)
              const centerDistance = Math.abs(row - centerRow) + Math.abs(col - centerCol)
              score += (settings.boardSize - centerDistance) * 3
              
              // Prefer corners and edges
              if ((row === 0 || row === settings.boardSize - 1) && 
                  (col === 0 || col === settings.boardSize - 1)) {
                score += 20 // Corners
              } else if (row === 0 || row === settings.boardSize - 1 || 
                        col === 0 || col === settings.boardSize - 1) {
                score += 10 // Edges
              }
              
              // Check for blocking opponent's potential wins
              for (let checkRow = 0; checkRow < settings.boardSize; checkRow++) {
                for (let checkCol = 0; checkCol < settings.boardSize; checkCol++) {
                  if (testBoardBlock[checkRow][checkCol] === 0) {
                    testBoardBlock[checkRow][checkCol] = 1
                    if (checkWinner(testBoardBlock, checkRow, checkCol, 1)) {
                      score += 50
                    }
                    testBoardBlock[checkRow][checkCol] = 0
                  }
                }
              }
            }
            
            availableMoves.push({ row, col, score })
          }
        }
      }
      
      availableMoves.sort((a, b) => b.score - a.score)
      const bestMove = availableMoves[0]
      
      if (bestMove) {
        makeMove(bestMove.row, bestMove.col)
      }
      
      setIsThinking(false)
    }, 800) // Slightly faster thinking time
  }, [gameState, settings, checkWinner, makeMove])

  useEffect(() => {
    if (mode === 'computer' && gameState.currentPlayer === 2 && !gameState.gameOver) {
      computerMove()
    }
  }, [gameState.currentPlayer, mode, gameState.gameOver, computerMove])

  useEffect(() => {
    if (settings.timeLimit > 0 && !gameState.gameOver) {
      const timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            const winner = prev.currentPlayer === 1 ? 2 : 1
            const winnerName = winner === 1 ? 'Player 1' : (mode === 'computer' ? 'Computer' : 'Player 2')
            toast(`Time's up! ${winnerName} wins!`)
            return { ...prev, timeLeft: 0, gameOver: true, winner }
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [settings.timeLimit, gameState.gameOver, mode])

  const resetGame = () => {
    setGameState({
      board: Array(settings.boardSize).fill(null).map(() => Array(settings.boardSize).fill(0)),
      currentPlayer: 1,
      winner: null,
      gameOver: false,
      moveHistory: [],
      powerUps: settings.enablePowerUps ? generatePowerUps(settings.boardSize) : [],
      timeLeft: settings.timeLimit,
      playerPowerUps: { 1: [], 2: [] }
    })
    setIsThinking(false)
  }

  const theme = themeStyles[settings.theme]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
      {/* Player Status Panels */}
      <PlayerStatus
        player={1}
        isCurrentPlayer={gameState.currentPlayer === 1}
        isComputer={false}
        isThinking={false}
        timeLeft={settings.timeLimit > 0 ? gameState.timeLeft : undefined}
        timeLimit={settings.timeLimit > 0 ? settings.timeLimit : undefined}
        position="left"
      />
      
      <PlayerStatus
        player={2}
        isCurrentPlayer={gameState.currentPlayer === 2}
        isComputer={mode === 'computer'}
        isThinking={isThinking}
        timeLeft={settings.timeLimit > 0 ? gameState.timeLeft : undefined}
        timeLimit={settings.timeLimit > 0 ? settings.timeLimit : undefined}
        position="right"
      />

      {/* Win Modal */}
      <WinModal
        isOpen={gameState.gameOver}
        winner={gameState.winner || 0}
        mode={mode}
        moveCount={gameState.moveHistory.length}
        onPlayAgain={resetGame}
        onBackToMenu={onGameEnd}
      />

      {/* Floating Reset Button */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30">
        <Button 
          onClick={resetGame} 
          variant="outline" 
          size="sm" 
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg"
        >
          Reset Game
        </Button>
      </div>

      <div className="w-full max-w-4xl space-y-4">
        <div className="flex justify-center">
          <Card className={`${theme.board} p-2 sm:p-4 w-full`} style={{ height: '70vh' }}>
            <CardContent className="p-0 h-full">
              <div className="grid gap-1 w-full h-full" style={{ 
                gridTemplateColumns: `repeat(${settings.boardSize}, minmax(0, 1fr))`
              }}>
                {gameState.board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-full h-full rounded transition-all duration-200 transform select-none
                        ${cell === 0 ? theme.cell : ''}
                        ${cell === 1 ? theme.player1 : ''}
                        ${cell === 2 ? theme.player2 : ''}
                        ${cell === 0 && !gameState.gameOver && !isThinking ? 'hover:scale-105 cursor-pointer active:scale-95' : ''}
                        ${cell !== 0 ? 'scale-95 cursor-not-allowed' : ''}
                        ${hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex && cell === 0 ? 'ring-1 ring-slate-400' : ''}
                      `}
                      onClick={() => makeMove(rowIndex, colIndex)}
                      onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                      onMouseLeave={() => setHoveredCell(null)}
                      onTouchStart={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                      onTouchEnd={() => setHoveredCell(null)}
                      disabled={gameState.gameOver || cell !== 0 || isThinking}
                    >
                      {cell !== 0 && (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          {cell}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}