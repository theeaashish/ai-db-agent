"use client"

import React from "react"
import { FileText, Download, Calendar, Tag, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Section {
  heading: string
  content: string
  data?: any
}

interface DocumentReportProps {
  title: string
  summary: string
  sections: Section[]
  generatedAt: string
  documentId: string
}

export function DocumentPreview({ 
  title, 
  summary, 
  sections, 
  generatedAt, 
  documentId 
}: DocumentReportProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<number, boolean>>({ 0: true })

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleDownload = () => {
    const reportData = { title, summary, sections, generatedAt, documentId }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${documentId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full max-w-2xl overflow-hidden border-none bg-card/40 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <CardHeader className="relative border-b border-border/50 bg-muted/30 pb-6">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary px-3 py-1 font-medium">
            <FileText className="w-3 h-3 mr-2" />
            Generated Report
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownload}
            className="hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-95"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
        
        <CardTitle className="text-3xl font-bold tracking-tight text-foreground/90 mb-2">
          {title}
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground leading-relaxed">
          {summary}
        </CardDescription>
        
        <div className="flex gap-4 mt-6 text-xs text-muted-foreground/70 font-medium">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1.5" />
            {new Date(generatedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Tag className="w-3 h-3 mr-1.5" />
            ID: {documentId}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {sections.map((section, index) => (
            <div key={index} className="group transition-colors hover:bg-muted/10">
              <button 
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <h3 className="font-semibold text-foreground/80 group-hover:text-primary transition-colors">
                  {section.heading}
                </h3>
                {expandedSections[index] ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {expandedSections[index] && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
                    {section.content}
                  </div>
                  {section.data && (
                    <div className="mt-4 bg-black/20 rounded-lg p-3 overflow-x-auto border border-white/5">
                      <pre className="text-[10px] leading-tight text-primary/70">
                        {JSON.stringify(section.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
