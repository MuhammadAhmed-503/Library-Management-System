import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faEnvelope, faPhone, faMapMarkerAlt, faFilePdf, faReceipt } from '@fortawesome/free-solid-svg-icons';

const CheckoutReceipt = ({ selectedBook, selectedBorrower }) => {
  const handleSaveAsPDF = () => {
    const pdfDoc = new jsPDF();
    
    pdfDoc.setFont('helvetica');
    pdfDoc.setFontSize(16);
  
    const { width } = pdfDoc.internal.pageSize;
    const textWidth = pdfDoc.getStringUnitWidth('Checkout Book Receipt') * 6;

    const centerX = (width - textWidth) / 2;

    pdfDoc.text('Checkout Book Receipt', centerX+3, 10);
    pdfDoc.setFontSize(12);
    pdfDoc.text('Selected Book Details', 15, 20);
    const bookData = [
      ['Title', selectedBook.title],
      ['Author', selectedBook.author.authorName],
      ['Category', selectedBook.category],
      ['Price', `${selectedBook.price.toFixed(2)}/-`],
    ];
    pdfDoc.autoTable({
      startY: 25,
      head: [],
      body: bookData,
      theme: 'grid',
      styles: { cellPadding: 1, fontSize: 11, fontStyle: 'normal' }
    });
  
    pdfDoc.text('Selected Borrower Details', 15, pdfDoc.autoTable.previous.finalY + 15);
    const borrowerData = [
      ['Name', selectedBorrower.borrowerName],
      ['Email', selectedBorrower.borrowerEmail],
      ['Address', selectedBorrower.borrowerAddress],
    ];
    pdfDoc.autoTable({
      startY: pdfDoc.autoTable.previous.finalY + 20,
      head: [],
      body: borrowerData,
      theme: 'grid',
      styles: { cellPadding: 1, fontSize: 11, fontStyle: 'normal' }
    });
  
    pdfDoc.save(`CheckoutReceipt-${selectedBook.title}.pdf`);
  };
  
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 p-3 sm:p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faReceipt} className="text-violet-400 text-sm sm:text-base" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-violet-300">Checkout Receipt</h2>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Book Details */}
          <div>
            <h3 className="text-xs sm:text-sm uppercase tracking-wide text-emerald-400 font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faBook} />
              Selected Book
            </h3>
            <div className="bg-slate-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2">
              <p className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-slate-500 text-xs sm:text-sm">Title</span>
                <span className="text-slate-200 font-medium text-sm sm:text-base">{selectedBook.title}</span>
              </p>
              <p className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-slate-500 text-xs sm:text-sm">Author</span>
                <span className="text-slate-200 text-sm sm:text-base">{selectedBook.author.authorName}</span>
              </p>
            </div>
          </div>

          {/* Borrower Details */}
          <div>
            <h3 className="text-xs sm:text-sm uppercase tracking-wide text-violet-400 font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} />
              Selected Borrower
            </h3>
            <div className="bg-slate-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2">
              <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                <span className="text-slate-500 flex items-center gap-2 text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faUser} className="text-xs" /> Name
                </span>
                <span className="text-slate-200 font-medium text-sm sm:text-base">{selectedBorrower.borrowerName}</span>
              </p>
              <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                <span className="text-slate-500 flex items-center gap-2 text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs" /> Email
                </span>
                <span className="text-slate-200 text-sm sm:text-base break-all">{selectedBorrower.borrowerEmail}</span>
              </p>
              <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                <span className="text-slate-500 flex items-center gap-2 text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faPhone} className="text-xs" /> Phone
                </span>
                <span className="text-slate-200 text-sm sm:text-base">{selectedBorrower.borrowerPhone}</span>
              </p>
              <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                <span className="text-slate-500 flex items-center gap-2 text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" /> Address
                </span>
                <span className="text-slate-200 text-sm sm:text-base">{selectedBorrower.borrowerAddress}</span>
              </p>
            </div>
          </div>

          {/* Save Button */}
          <button
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 flex items-center justify-center gap-2 text-sm sm:text-base"
            onClick={handleSaveAsPDF}
          >
            <FontAwesomeIcon icon={faFilePdf} />
            Save as PDF
          </button>
        </div>
      </div>
    );
};
export default CheckoutReceipt;