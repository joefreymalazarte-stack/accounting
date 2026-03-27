import { z } from 'zod'

// Profile Schemas
export const ProfileSchema = z.object({
  username: z.string().min(2, "Name is too short").max(50, "Name is too long").optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
  currency_code: z.string().length(3, "Invalid currency code"),
})

export const PasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirmation password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Transaction Schemas
export const SourceDocumentSchema = z.object({
  type: z.string().min(1, "Type is required"),
  document_number: z.string().min(1, "Document number is required"),
  date: z.string(),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  description: z.string().min(1, "Description is required"),
})

export const JournalEntrySchema = z.object({
  date: z.string(),
  description: z.string().min(1, "Description is required"),
  reference_id: z.string().optional().nullable(),
  entries: z.array(z.object({
    account: z.string().min(1, "Account name is required"),
    debit: z.coerce.number().min(0, "Debit cannot be negative"),
    credit: z.coerce.number().min(0, "Credit cannot be negative"),
  })).min(2, "At least two entries are required (Double-entry)").refine(
    (entries) => {
      const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0)
      const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0)
      return Math.abs(totalDebit - totalCredit) < 0.01
    },
    { message: "Journal entry must be balanced (Total Debit = Total Credit)" }
  )
})
