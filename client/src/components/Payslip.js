import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from 'docx';
import {getDetailedSlip} from "../services/salaryService"

const PaySlipDetail = ({ auth }) => {
  const { employeeId, month } = useParams();
  const [paySlip, setPaySlip] = useState(null);
  const paySlipRef = useRef(null); // Reference to the pay slip container for printing

  useEffect(() => {
    async function fetchData() {
      const data = await getDetailedSlip(employeeId, month); 
      if (data.success) {
        setPaySlip(data.salarySlip);
      }
      console.log('salary in details ', data.salarySlip);
    }
    fetchData();
  }, [employeeId, month]);

  if (!paySlip) return <div className="text-center p-4">Loading...</div>;

  // Function to create and download a DOCX file
  const downloadDOCX = () => {
    const salaryData = paySlip; // Assuming this is correctly populated with your paySlip data
  
    // Create a table for salary components
    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Addition")],
              width: { size: 50, type: "pct" },
            }),
            new TableCell({
              children: [new Paragraph("Amount")],
              width: { size: 25, type: "pct" },
            }),
            new TableCell({
              children: [new Paragraph("Deduction")],
              width: { size: 50, type: "pct" },
            }),
            new TableCell({
              children: [new Paragraph("Amount")],
              width: { size: 25, type: "pct" },
            }),
          ],
        }),
        // Row 1
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Basic Salary")],
            }),
            new TableCell({
              children: [new Paragraph(`₹${salaryData.salaryComponents.baseSalary}`)],
            }),
            new TableCell({
              children: [new Paragraph("Leave Taken")],
            }),
            new TableCell({
              children: [new Paragraph("₹0")],
            }),
          ],
        }),
        // Row 2
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("House Rent Allowance (HRA)")],
            }),
            new TableCell({
              children: [new Paragraph(`₹${salaryData.salaryComponents.HRA}`)],
            }),
            new TableCell({
              children: [new Paragraph("Other Deduction")],
            }),
            new TableCell({
              children: [new Paragraph("₹0")],
            }),
          ],
        }),
        // Row 3
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Travel Allowance (TA)")],
            }),
            new TableCell({
              children: [new Paragraph(`₹${salaryData.salaryComponents.TA}`)],
            }),
            new TableCell({
              children: [new Paragraph("Tax Deduction")],
            }),
            new TableCell({
              children: [new Paragraph("₹0")],
            }),
          ],
        }),
        // Row 4
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Dareeness Allowance")],
            }),
            new TableCell({
              children: [new Paragraph(`₹${salaryData.salaryComponents.DA}`)],
            }),
            new TableCell({
              children: [new Paragraph("ESIC Deduction")],
            }),
            new TableCell({
              children: [new Paragraph("₹0")],
            }),
          ],
        }),
        // Row 5
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Conveyance")],
            }),
            new TableCell({
              children: [new Paragraph(`₹${salaryData.salaryComponents.allowances}`)],
            }),
            new TableCell({
              children: [new Paragraph("Final Salary")],
            }),
            new TableCell({
              children: [new Paragraph(`₹${salaryData.payableSalary}`)],
            }),
          ],
        }),
      ],
    });
  
    // Create the DOCX document with header and the table
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header Section: Salary Slip
            new Paragraph({
              children: [
                new TextRun({
                  text: "Salary Slip",
                  bold: true,
                  size: 24,
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({
              children: [
                new TextRun(`Employee ID: ${salaryData.employeeId}`),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(`Month: ${salaryData.month}`),
              ],
            }),
  
            // Table Section: Salary Components
            new Paragraph({
              children: [
                new TextRun({
                  text: "Salary Details",
                  bold: true,
                }),
              ],
            }),
  
            table,
          ],
        },
      ],
    });
  
    // Generate the .docx file
    Packer.toBlob(doc).then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Pay_Slip_${salaryData.employeeId}_${salaryData.month}.docx`;
      link.click();
    });
  };
  

  // Function to download the PDF (keeping your original code for PDF download)
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Grab the content of the pay slip for the PDF
    const content = paySlipRef.current;

    // Use the html() method of jsPDF to add the content
    doc.html(content, {
      callback: function (doc) {
        doc.save(`Pay_Slip_${employeeId}_${month}.pdf`);
      },
      margin: [5, 5, 5, 5],
      autoPaging: true,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-4 lg:px-4 py-4" style={{ maxHeight: '95vh', overflowY: 'auto' }}>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden" ref={paySlipRef}>
        {/* Pay Slip Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-3">Salary Slip</h2>
          <div className="flex justify-between text-sm">
            <div>
              <p className="font-medium text-gray-600">
                Employee ID: <span className="font-bold">{paySlip.employeeId}</span>
              </p>
              <p className="font-medium text-gray-600">
                Month: <span className="font-bold">{paySlip.month}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-600">Company Name</p>
              <p className="text-xs text-gray-600">Your Company Ltd.</p>
            </div>
          </div>
        </div>

        {/* Pay Slip Details (Table Layout) */}
        <div className="p-4">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr>
                <th className="text-left py-2">Addition</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Deduction</th>
                <th className="text-left py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Add rows based on your salary components */}
              <tr>
                <td className="text-gray-600 py-2">Basic Salary</td>
                <td className="font-semibold text-gray-800 text-right">
                  ₹{paySlip.salaryComponents.baseSalary.toLocaleString()}
                </td>
                <td className="text-gray-600 py-2">Leave Taken</td>
                <td className="font-semibold text-gray-800 text-right">-0 days</td>
              </tr>
              <tr>
                <td className="text-gray-600 py-2">House Rent Allowance (HRA)</td>
                <td className="font-semibold text-gray-800 text-right">
                  ₹{paySlip.salaryComponents.HRA.toLocaleString()}
                </td>
                <td className="text-gray-600 py-2">Deduction</td>
                <td className="font-semibold text-gray-800 text-right">-0</td>
              </tr>
              <tr>
                <td className="text-gray-600 py-2">Travel Allowance (TA)</td>
                <td className="font-semibold text-gray-800 text-right">
                  ₹{paySlip.salaryComponents.TA.toLocaleString()}
                </td>
                <td className="text-gray-600 py-2">Other Deduction</td>
                <td className="font-semibold text-gray-800 text-right">-0</td>
              </tr>
              <tr>
                <td className="text-gray-600 py-2">Bonus</td>
                <td className="font-semibold text-gray-800 text-right">
                  ₹{paySlip.salaryComponents.bonus}
                </td>
                <td className="text-gray-600 py-2">Final Salary</td>
                <td className="font-semibold text-green-600 text-right">
                  ₹{paySlip.payableSalary}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Buttons Section */}
        <div className="p-4 text-center flex justify-center space-x-4 mt-4 mb-4">
          <button
            onClick={downloadPDF}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          >
            Download Pay Slip (PDF)
          </button>
          <button
            onClick={downloadDOCX}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          >
            Download Pay Slip (DOCX)
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          >
            Print Pay Slip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaySlipDetail;
