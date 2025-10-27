import { inject, Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { SnackbarService } from '../snackbar/snackbar.service';

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
  private readonly snackbar = inject(SnackbarService);

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

  public downloadReceipt(reportData: SalesReportData, filename: string = 'Sales report.pdf'): void {
    this.snackbar.showInfo('Preparing download...', 2000);

    try {
      const docDefinition: TDocumentDefinitions = {
        ...reportData.data,
        ...docDefinitionMinusData,
      };

      pdfMake.createPdf(docDefinition).download(filename);
    } catch {
      this.snackbar.showError('Failed to download the report. Please try again.');
    }
  }

  public printReceipt(reportData: SalesReportData): void {
    try {
      const docDefinition: TDocumentDefinitions = {
        ...reportData.data,
        ...docDefinitionMinusData,
      };

      pdfMake.createPdf(docDefinition).print();
    } catch {
      this.snackbar.showError('Failed to print the report. Please try again.');
    }
  }
}

