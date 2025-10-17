"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Chat Assistant</h1>
          <p className="text-sm text-muted-foreground">Powered by AI</p>
        </div>
      </div>

      {/* Messages Container - Added pb-32 to account for fixed input area */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground">Start a conversation</h2>
                <p className="text-muted-foreground max-w-md">Ask me anything and I'll do my best to help you out.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {/* Avatar */}
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-semibold text-primary">AI</span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={cn(
                    "max-w-2xl rounded-lg px-4 py-3 break-words",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card border border-border text-foreground rounded-bl-none",
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return <div key={`${message.id}-${i}`}>{part.text}</div>
                        case "tool-db":
                        case "tool-schema":
                          return (
                            <pre
                              key={`${message.id}-${i}`}
                              className="bg-muted p-3 rounded mt-2 text-xs overflow-x-auto"
                            >
                              {JSON.stringify(part, null, 2)}
                            </pre>
                          )
                        default:
                          return null
                      }
                    })}
                  </div>
                </div>

                {/* User Avatar */}
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-semibold text-primary-foreground">You</span>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-primary">AI</span>
              </div>
              <div className="bg-card border border-border rounded-lg px-4 py-3 rounded-bl-none">
                <div className="flex gap-2 items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Changed to fixed positioning to always stay at bottom */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/50 backdrop-blur-sm z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 w-full">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-background border-border focus-visible:ring-primary"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="flex-shrink-0">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
