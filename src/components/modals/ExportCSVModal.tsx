import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Download, FileText } from "lucide-react"

interface ExportCSVModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dataType: string
  availableColumns: string[]
}

export function ExportCSVModal({ open, onOpenChange, dataType, availableColumns }: ExportCSVModalProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(availableColumns)

  const handleColumnToggle = (column: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, column])
    } else {
      setSelectedColumns(selectedColumns.filter(c => c !== column))
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      setExportProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Create and download CSV
    const csvContent = [
      selectedColumns.join(','),
      // Add sample data rows
      selectedColumns.map(() => 'Sample Data').join(',')
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dataType}_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    setIsExporting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export {dataType} to CSV
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Select Columns to Export</Label>
            <div className="mt-3 space-y-3 max-h-48 overflow-y-auto">
              {availableColumns.map((column) => (
                <div key={column} className="flex items-center space-x-2">
                  <Checkbox
                    id={column}
                    checked={selectedColumns.includes(column)}
                    onCheckedChange={(checked) => handleColumnToggle(column, !!checked)}
                  />
                  <Label htmlFor={column} className="text-sm capitalize">
                    {column.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {isExporting && (
            <div className="space-y-2">
              <Label className="text-sm">Export Progress</Label>
              <Progress value={exportProgress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                Exporting {dataType}... {exportProgress}%
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button 
              variant="medical" 
              onClick={handleExport} 
              className="flex-1 gap-2"
              disabled={selectedColumns.length === 0 || isExporting}
            >
              <FileText className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}