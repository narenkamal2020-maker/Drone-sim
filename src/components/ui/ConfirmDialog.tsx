"use client";

import React from "react";
import { Trash2, X, Loader2 } from "lucide-react";
import Button from "./Button";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-400" />
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">{description}</p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white border-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                {confirmLabel}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
