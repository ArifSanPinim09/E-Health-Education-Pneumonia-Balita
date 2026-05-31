'use client'

import { useState } from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Tombol export "Master Data" yang mengikuti template Excel kustom
 * (struktur header bertingkat Pre/Post Test).
 * Terpisah dari ExportButton agar export lama tetap tersedia.
 */
export function ExportMasterButton({ search = '', filter = 'all' }: { search?: string; filter?: string }) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setError(null)

      // Sertakan filter & pencarian yang aktif di halaman
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filter && filter !== 'all') params.append('filter', filter)
      const query = params.toString()

      const response = await fetch(`/api/admin/export-master${query ? `?${query}` : ''}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Gagal mengekspor master data')
      }

      const blob = await response.blob()

      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'Master_Data_Pneumonia.xlsx'

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export master data error:', err)
      setError(err instanceof Error ? err.message : 'Gagal mengekspor master data')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleExport}
        disabled={isExporting}
        variant="outline"
        className="border-[#2F5D50] text-[#2F5D50] hover:bg-[#2F5D50] hover:text-white shadow-sm min-h-[48px]"
      >
        {isExporting ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Mengekspor...
          </>
        ) : (
          <>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Ekspor Master Data
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs sm:text-sm text-[#E07A5F]">{error}</p>
      )}
    </div>
  )
}
