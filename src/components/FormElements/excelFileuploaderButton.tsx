import React, { useCallback, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface RowData {
  fact: string;
  description: string;
}

interface ProcessedData {
  rowData: RowData;
}

interface ExcelFileuploaderButtonProps {
  onFileUpload: (data: ProcessedData[]) => void;
  acceptedFileTypes?: string;
}

const ExcelFileuploaderButton: React.FC<ExcelFileuploaderButtonProps> = ({
  onFileUpload,
  acceptedFileTypes = '.csv, .xlsx, .xls',
}) => {
  const handleFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        let parsedData: RowData[] = [];

        if (file.name.endsWith('.csv')) {
          // Parse CSV file with improved configuration
          parsedData = await parseCSV(file);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Parse Excel file with improved configuration
          parsedData = await parseExcel(file);
        } else {
          console.error('Unsupported file type');
          return;
        }

        // Filter out empty rows and transform data
        const formattedData: ProcessedData[] = parsedData
          .filter(row => {
            // Check if row has any non-empty values
            return Object.values(row).some(val => val !== undefined && val !== null && val !== '');
          })
          .map(row => ({
            rowData: row
          }));

        onFileUpload(formattedData);
      } catch (error) {
        console.error('Error parsing file:', error);
      } finally {
        event.target.value = '';
      }
    },
    [onFileUpload]
  );

  const parseCSV = (file: File): Promise<RowData[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true, // This fixes empty line issues
        complete: (results) => {
          // Additional filtering for any remaining empty rows
          const filteredData = results.data.filter((row: any) => 
            Object.values(row).some(val => val !== undefined && val !== null && val !== '')
          );
          resolve(filteredData as RowData[]);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const parseExcel = async (file: File): Promise<RowData[]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Use range option to properly handle empty rows
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      defval: null, // Treat empty cells as null instead of undefined
      skipHidden: true, // Skip hidden rows
    });
    
    // Filter out empty rows
    return (jsonData as RowData[]).filter(row => 
      Object.values(row).some(val => val !== null && val !== undefined && val !== '')
    );
  };

  return (
    <div className="file-uploader">
      <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 mb-6">
        Upload CSV or Excel
        <input
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>
      <style jsx>{`
        .upload-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }
        .upload-button:hover {
          background-color: #0366d6;
        }
      `}</style>
    </div>
  );
};

export default ExcelFileuploaderButton;