'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setError(null)

      // Call export API
      const response = await fetch('/api/admin/export', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Gagal mengekspor data')
      }

      // Get the blob from response
      const blob = await response.blob()

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'Data_Responden_Pneumonia.xlsx'
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
      setError(err instanceof Error ? err.message : 'Gagal mengekspor data')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="bg-[#10B981] hover:bg-[#059669] text-white shadow-sm min-h-[48px]"
      >
        {isExporting ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Mengekspor...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Ekspor ke Excel
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-xs sm:text-sm text-[#E07A5F]">
          {error}
        </p>
      )}
    </div>
  )
}
