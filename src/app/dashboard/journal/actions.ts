'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

import { JournalEntrySchema } from '@/utils/validation'

export async function createJournalEntry(
  date: string,
  description: string,
  entries: { account: string; debit: number; credit: number }[]
) {
  const supabase = await createClient()

  // Validate with Zod
  const validationResult = JournalEntrySchema.safeParse({ date, description, entries })
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Insert Journal Entry
  const { data: journalEntry, error: journalError } = await supabase
    .from('journal_entries')
    .insert({
      user_id: user.id,
      date,
      description,
      reference_id: validationResult.data.reference_id || null,
    })
    .select()
    .single()

  if (journalError) {
    console.error('Journal Error:', journalError)
    return { error: `Journal Insert Error: ${journalError.message} (${journalError.code})` }
  }

  // 2. Insert Ledger Entries
  const ledgerItems = entries.map(item => ({
    user_id: user.id,
    journal_entry_id: journalEntry.id,
    account_name: item.account,
    debit: item.debit,
    credit: item.credit,
  }))

  const { error: ledgerError } = await supabase
    .from('ledger_entries')
    .insert(ledgerItems)

  if (ledgerError) {
    console.error('Ledger Error:', ledgerError)
    return { error: `Ledger Insert Error: ${ledgerError.message} (${ledgerError.code})` }
  }

  revalidatePath('/dashboard/journal')
  revalidatePath('/dashboard/ledger')
  revalidatePath('/dashboard/trial-balance')
  revalidatePath('/dashboard/financial-statements')
  
  return { success: true }
}

export async function deleteJournalEntry(id: string) {
  console.log('Attempting to delete journal entry:', id)
  const supabase = await createClient()
  const { error } = await supabase.from('journal_entries').delete().eq('id', id)
  
  if (error) {
    console.error(error)
    return { error: `Failed to delete journal entry: ${error.message}` }
  }

  revalidatePath('/dashboard/journal')
  revalidatePath('/dashboard/ledger')
  revalidatePath('/dashboard/trial-balance')
  revalidatePath('/dashboard/financial-statements')
  
  return { success: true }
}
