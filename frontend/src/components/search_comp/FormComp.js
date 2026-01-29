import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faTag, faDollarSign, faCheckCircle, faTrash, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const FormComp = ({ form_data, setConfirm, handler, type, selectedItem }) => {
  const inputClass = "w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-300 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm sm:text-base";
  const labelClass = "block text-slate-300 font-medium mb-2 text-sm sm:text-base";
  
  return type === "checkin" ? (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-xl mx-auto w-full">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-xl mt-4">
        <div className="mb-4 sm:mb-5">
          <label htmlFor="title" className={labelClass}>
            <FontAwesomeIcon icon={faBook} className="mr-2 text-cyan-500" />
            Title
          </label>
          <input
            type="text"
            id="title"
            className={inputClass}
            value={form_data.title}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="borrowerName" className={labelClass}>
            <FontAwesomeIcon icon={faUser} className="mr-2 text-cyan-500" />
            Borrower Name
          </label>
          <input
            type="text"
            id="borrowerName"
            className={inputClass}
            value={form_data.borrowerName}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="category" className={labelClass}>
            <FontAwesomeIcon icon={faTag} className="mr-2 text-cyan-500" />
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            className={inputClass}
            value={form_data.category}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="price" className={labelClass}>
            <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-cyan-500" />
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            className={inputClass}
            value={form_data.price}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="confirm_checkin" className={labelClass}>
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-emerald-500" />
            Confirm Checkin
          </label>
          <input
            type="text"
            id="confirm_checkin"
            placeholder="Type 'checkin' to confirm"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-emerald-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm sm:text-base"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>
      <button
        type="button"
        className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base"
        onClick={handler}
      >
        <FontAwesomeIcon icon={faCheckCircle} />
        Confirm Check In
      </button>
    </form>
  ) : type === "deletebook" ? (
    <form className="max-w-xl mx-auto w-full">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-xl">
        <div className="mb-4 sm:mb-5">
          <label htmlFor="title" className={labelClass}>
            <FontAwesomeIcon icon={faBook} className="mr-2 text-red-500" />
            Book Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            readOnly
            className={inputClass}
            value={form_data.title}
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="authorName" className={labelClass}>
            <FontAwesomeIcon icon={faUser} className="mr-2 text-red-500" />
            Author Name
          </label>
          <input
            type="text"
            name="authorName"
            id="authorName"
            readOnly
            className={inputClass}
            value={form_data.authorName}
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="category" className={labelClass}>
            <FontAwesomeIcon icon={faTag} className="mr-2 text-red-500" />
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            className={inputClass}
            value={form_data.category}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="price" className={labelClass}>
            <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-red-500" />
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            className={inputClass}
            value={form_data.price}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="confirm_delete" className={labelClass}>
            <FontAwesomeIcon icon={faTrash} className="mr-2 text-red-500" />
            Confirm Delete
          </label>
          <input
            type="text"
            name="confirm_delete"
            id="confirm_delete"
            placeholder="Type 'delete' to confirm"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-red-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-sm sm:text-base"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>
    </form>
  ) : type === "deleteborrower" ? (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-xl mx-auto w-full">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-xl mt-4">
        <div className="mb-4 sm:mb-5">
          <label htmlFor="borrower_name" className={labelClass}>
            <FontAwesomeIcon icon={faUser} className="mr-2 text-red-500" />
            Name
          </label>
          <input
            type="text"
            name="borrowerName"
            id="borrower_name"
            className={inputClass}
            value={selectedItem.borrowerName}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="borrower_email" className={labelClass}>
            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-red-500" />
            Email
          </label>
          <input
            type="text"
            name="borrowerEmail"
            id="borrower_email"
            className={inputClass}
            value={selectedItem.borrowerEmail}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="borrower_phone" className={labelClass}>
            <FontAwesomeIcon icon={faPhone} className="mr-2 text-red-500" />
            Phone
          </label>
          <input
            type="text"
            name="borrowerPhone"
            id="borrower_phone"
            className={inputClass}
            value={selectedItem.borrowerPhone}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="borrower_address" className={labelClass}>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
            Address
          </label>
          <input
            type="text"
            name="borrowerAddress"
            id="borrower_addreess"
            className={inputClass}
            value={selectedItem.borrowerAddress}
            readOnly
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <label htmlFor="confirm_delete" className={labelClass}>
            <FontAwesomeIcon icon={faTrash} className="mr-2 text-red-500" />
            Confirm Delete
          </label>
          <input
            type="text"
            name="confirmDelete"
            id="confirm_delete"
            placeholder="Type 'delete' to confirm"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-red-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-sm sm:text-base"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>
    </form>
  ) : (
    <p className="text-slate-400">Invalid form type</p>
  );
};
export default FormComp;
