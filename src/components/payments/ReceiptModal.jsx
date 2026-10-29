import React from 'react'
import { Modal } from '../common/Modal'
import { Printer, CheckCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useUI } from '../../store/UIContext'

export function ReceiptModal({ isOpen, onClose, payment }) {
  const { currency } = useUI()

  if (!payment) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="To'lov kvitansiyasi (Chek)" maxWidth="max-w-md">
      <div className="space-y-6">
        {/* Printable Area */}
        <div id="printable-receipt" className="p-6 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-inner">
          <div className="text-center border-b pb-4">
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="font-black text-xl text-blue-600">IT LIVE</span>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Academy</span>
            </div>
            <p className="text-[11px] text-slate-500">Toshkent sh., Amir Temur ko‘chasi, 107-B</p>
            <p className="text-[11px] text-slate-500">Tel: +998 (71) 200-00-55</p>
          </div>

          <div className="py-4 space-y-2 text-xs border-b">
            <div className="flex justify-between">
              <span className="text-slate-500">Kvitansiya №:</span>
              <span className="font-mono font-bold text-slate-900">{payment.receiptNumber || 'REC-2026-001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sana:</span>
              <span className="font-semibold text-slate-900">{formatDate(payment.paidDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">O'quvchi:</span>
              <span className="font-bold text-slate-900">{payment.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kurs nomi:</span>
              <span className="text-slate-800">{payment.courseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">To'lov usuli:</span>
              <span className="font-semibold text-slate-800">{payment.method}</span>
            </div>
          </div>

          <div className="py-4 text-center">
            <span className="text-xs text-slate-500 block uppercase font-medium">To'langan summa</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">
              {formatCurrency(payment.amount, currency)}
            </span>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2">
              <CheckCircle className="w-3.5 h-3.5" /> Muvaffaqiyatli to'landi
            </div>
          </div>

          <div className="border-t pt-3 text-center text-[10px] text-slate-400">
            To'lov qabul qilinganligi to'g'risida rasmiy elektron chek.
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
          >
            Yopish
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" /> Chekni chop etish
          </button>
        </div>
      </div>
    </Modal>
  )
}
