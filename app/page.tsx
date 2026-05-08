"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Database, Layout, FileBarChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { DocumentPreview } from "@/components/DocumentPreview"

export default function Chat() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "streaming") return

    sendMessage({ text: input })
    setInput("")
  }

  const isLoading = status === "streaming"

  return (
    <div className="flex flex-col h-full bg-[#030303] text-zinc-100 font-sans selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                AI DB Agent
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">System Operational</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
            <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">History</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-zinc-500">Settings</Button>
          </nav>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto pb-40">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative w-20 h-20 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl">
                  <Layout className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">
                  How can I help you <span className="text-primary">query today?</span>
                </h2>
                <p className="text-zinc-400 max-w-lg mx-auto text-lg leading-relaxed">
                  Analyze your database, generate reports, or visualize sales data with natural language.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                {[
                  "Show me all products with low stock",
                  "Generate a sales report for North region",
                  "Who are our top 5 customers?",
                  "Analyze monthly revenue trends"
                ].map((suggest) => (
                  <button
                    key={suggest}
                    onClick={() => setInput(suggest)}
                    className="p-4 text-left rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-primary/50 hover:bg-zinc-900 transition-all group"
                  >
                    <p className="text-sm font-medium text-zinc-300 group-hover:text-white">{suggest}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 group",
                  message.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                  message.role === "assistant" 
                    ? "bg-zinc-900 border border-white/10 text-primary shadow-lg" 
                    : "bg-primary text-white shadow-lg shadow-primary/20"
                )}>
                  {message.role === "assistant" ? <Database className="w-5 h-5" /> : <span className="text-xs font-bold">ME</span>}
                </div>

                {/* Message Content */}
                <div className={cn(
                  "flex flex-col gap-3 max-w-[85%]",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-zinc-900/80 border border-white/5 text-zinc-200 rounded-tl-none backdrop-blur-md"
                  )}>
                    {message.parts.map((part, i) => {
                      if (part.type === "text") {
                        return <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">{part.text}</div>
                      }
                      
                      if (part.type === "tool-invocation") {
                        const { toolName, result, state } = part
                        
                        if (state === "call") {
                          return (
                            <div key={`${message.id}-${i}`} className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-zinc-500 italic">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Executing {toolName}...
                            </div>
                          )
                        }

                        if (state === "result") {
                          if (toolName === "generate_report") {
                            return (
                              <div key={`${message.id}-${i}`} className="mt-4 w-full">
                                <DocumentPreview {...(result as any)} />
                              </div>
                            )
                          }
                          
                          return (
                            <div key={`${message.id}-${i}`} className="mt-2 overflow-hidden rounded-xl border border-white/5 bg-black/60">
                              <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                  {toolName === "db" ? <Database className="w-3 h-3 text-primary" /> : <Layout className="w-3 h-3 text-blue-400" />}
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{toolName} Result</span>
                                </div>
                                <Badge variant="outline" className="text-[9px] h-4 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Success</Badge>
                              </div>
                              <pre className="p-4 text-[11px] font-mono leading-relaxed text-zinc-400 overflow-x-auto max-h-60 scrollbar-thin">
                                {JSON.stringify(result, null, 2)}
                              </pre>
                            </div>
                          )
                        }
                        
                        return null
                      }
                      
                      return null
                    })}
                  </div>
                  
                  {/* Timestamp/Status (Subtle) */}
                  <span className="text-[10px] text-zinc-600 font-medium px-1">
                    {message.role === "assistant" ? "Agent • Just now" : "You • Just now"}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 text-primary animate-pulse">
                <Database className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-zinc-900/80 border border-white/5 rounded-2xl rounded-tl-none px-5 py-4 backdrop-blur-md">
                  <div className="flex gap-3 items-center">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    </div>
                    <span className="text-sm font-medium text-zinc-400">Agent is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[24px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            
            <form 
              onSubmit={handleSubmit} 
              className="relative flex items-center gap-2 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[22px] p-2 shadow-2xl focus-within:border-primary/40 transition-colors"
            >
              <div className="pl-4 text-zinc-500">
                <Layout className="w-5 h-5" />
              </div>
              <Input
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                placeholder="Ask about products, sales, or generate a report..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base py-6 placeholder:text-zinc-600"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="rounded-xl px-5 h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </form>
          </div>
          <p className="text-[10px] text-center mt-4 text-zinc-600 font-medium tracking-wide uppercase">
            Built for High Performance Data Analysis
          </p>
        </div>
      </div>
    </div>
  )
}
