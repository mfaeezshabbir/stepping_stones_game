'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { GameBoard } from '@/components/game-board'
import { Settings, Users, Bot, Play } from 'lucide-react'

export interface GameSettings {
  boardSize: number
  winCondition: number
  computerDifficulty: 'easy' | 'medium' | 'hard'
  enablePowerUps: boolean
  timeLimit: number
  theme: 'classic' | 'neon' | 'nature'
}

export default function Home() {
  const [gameMode, setGameMode] = useState<'menu' | 'friends' | 'computer'>('menu')
  const [gameStarted, setGameStarted] = useState(false)
  const [settings, setSettings] = useState<GameSettings>({
    boardSize: 8,
    winCondition: 5,
    computerDifficulty: 'medium',
    enablePowerUps: false,
    timeLimit: 0,
    theme: 'classic'
  })

  const startGame = (mode: 'friends' | 'computer') => {
    setGameMode(mode)
    setGameStarted(true)
  }

  const resetGame = () => {
    setGameMode('menu')
    setGameStarted(false)
  }

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="absolute top-2 left-2 right-2 z-10">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {gameMode === 'friends' ? <Users className="w-3 h-3 mr-1" /> : <Bot className="w-3 h-3 mr-1" />}
                {gameMode === 'friends' ? '2 Players' : 'vs Computer'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {settings.boardSize}x{settings.boardSize}
              </Badge>
              {settings.computerDifficulty && gameMode === 'computer' && (
                <Badge variant="default" className="text-xs">
                  {settings.computerDifficulty}
                </Badge>
              )}
            </div>
            <Button onClick={resetGame} variant="outline" size="sm" className="h-7 px-2 text-xs">
              Menu
            </Button>
          </div>
        </div>
        
        <GameBoard 
          mode={gameMode}
          settings={settings}
          onGameEnd={resetGame}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 pt-8 sm:pt-12">
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4">
            <img
              src="/logo.png"
              alt="Stepping Stones Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Stepping Stones
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">
            Connect your path from one side to the other
          </p>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 max-w-md mx-auto">
            Take turns placing stones on the board. First to connect {settings.winCondition} stones in a row wins!
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => startGame('friends')}>
            <CardHeader className="text-center pb-3">
              <Users className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg sm:text-xl">Play with Friends</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Challenge a friend on the same device
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full" size="sm">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Start 2 Player Game
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => startGame('computer')}>
            <CardHeader className="text-center pb-3">
              <Bot className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg sm:text-xl">Play vs Computer</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Test your skills against AI
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full" variant="secondary" size="sm">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Start Single Player
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              Game Settings
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Customize your game experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
                <TabsTrigger value="appearance" className="text-xs">Theme</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Board Size: {settings.boardSize}x{settings.boardSize}</Label>
                    <Slider
                      value={[settings.boardSize]}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, boardSize: value }))}
                      min={6}
                      max={12}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Win Condition: {settings.winCondition} in a row</Label>
                    <Slider
                      value={[settings.winCondition]}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, winCondition: value }))}
                      min={3}
                      max={6}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Computer Difficulty</Label>
                  <Select 
                    value={settings.computerDifficulty} 
                    onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                      setSettings(prev => ({ ...prev, computerDifficulty: value }))
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy - Random moves</SelectItem>
                      <SelectItem value="medium">Medium - Basic strategy</SelectItem>
                      <SelectItem value="hard">Hard - Advanced AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs sm:text-sm">Enable Power-ups</Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Special abilities to enhance gameplay
                    </p>
                  </div>
                  <Switch
                    checked={settings.enablePowerUps}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enablePowerUps: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Time Limit (seconds): {settings.timeLimit === 0 ? 'No limit' : settings.timeLimit}</Label>
                  <Slider
                    value={[settings.timeLimit]}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, timeLimit: value }))}
                    min={0}
                    max={60}
                    step={10}
                    className="w-full"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Theme</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value: 'classic' | 'neon' | 'nature') => 
                      setSettings(prev => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic - Clean and minimal</SelectItem>
                      <SelectItem value="neon">Neon - Bright and vibrant</SelectItem>
                      <SelectItem value="nature">Nature - Earth tones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}