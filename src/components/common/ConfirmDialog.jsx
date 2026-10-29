import React from 'react'
import { Modal } from './Modal'
import { AlertTriangle } from 'lucide-react'

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Ishonchingiz komilmi?',
  message = 'Bu amalni ortga qaytarib bo‘lmaydi. Haqiqatan ham davom ettirmoqchimisiz?',
  confirmText = 'Ha, o‘chirish',
  cancelText = 'Bekor qilish',
  isDanger = true
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
          <p>{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-all shadow-lg ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
