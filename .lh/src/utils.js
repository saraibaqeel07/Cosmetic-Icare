 // Function to manually trigger PDF download
 export const handleExportWithComponent = (pdfExportComponent) => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save()
    }
  }