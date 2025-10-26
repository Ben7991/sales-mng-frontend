import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

interface SalesReportData {
  data: {
    defaultStyle: any;
    content: any[];
    styles: any;
  };
}

interface TDocDefinitionMinusData extends Omit<TDocumentDefinitions, 'content'> { }

const docDefinitionMinusData: TDocDefinitionMinusData = {
  pageSize: 'A4',
  pageMargins: [40, 60, 40, 60],
  defaultStyle: {
    font: "Roboto",
  }
}

@Injectable({
  providedIn: 'root'
})
export class ReportDownloadService {
  private fontsInitialized = false;

  constructor() {
    this.initializeFonts();
  }

  private initializeFonts(): void {
    if (this.fontsInitialized) return;

    pdfMake.fonts = {
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf'
      }
    };

    this.fontsInitialized = true;
  }

  public downloadPDF(reportData: SalesReportData, filename: string = 'sales-report.pdf'): void {
    try {
      const docDefinition: TDocumentDefinitions = {
        ...reportData.data,
        ...docDefinitionMinusData,
      };

      pdfMake.createPdf(docDefinition).download(filename);
    } catch {
      //
    }
  }

  /**
   * Get print-friendly PDF blob (for printing)
   */
  public async getPrintBlob(reportData: SalesReportData): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const docDefinition: TDocumentDefinitions = {
          ...reportData.data,
          ...docDefinitionMinusData,
        };

        pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
          resolve(blob);
        });
      } catch {
        //
      }
    });
  }

  public printPDF(reportData: SalesReportData): void {
    try {
      const docDefinition: TDocumentDefinitions = {
        ...reportData.data,
        ...docDefinitionMinusData,
      };

      pdfMake.createPdf(docDefinition).print();
    } catch {
      //
    }
  }
}

