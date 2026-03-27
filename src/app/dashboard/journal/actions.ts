'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type JournalEntryInput = {
  date: string
  description: string
  reference_id?: string
  items: {
    account_name: string
    debit: number
    credit: number
  }[]
}

export async function createJournalEntry(input: JournalEntryInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Insert Journal Entry
  const { data: journalEntry, error: journalError } = await supabase
    .from('journal_entries')
    .insert({
      user_id: user.id,
      date: input.date,
      description: input.description,
      reference_id: input.reference_id || null,
    })
    .select()
    .single()

  if (journalError) {
    console.error(journalError)
    return { error: 'Failed to create journal entry' }
  }

  // 2. Insert Ledger Entries
  const ledgerItems = input.items.map(item => ({
    user_id: user.id,
    journal_entry_id: journalEntry.id,
    account_name: item.account_name,
    debit: item.debit,
    credit: item.credit,
  }))

  const { error: ledgerError } = await supabase
    .from('ledger_entries')
    .insert(ledgerItems)

  if (ledgerError) {
    console.error(ledgerError)
    // Optional: rollback journal entry if ledger fails? 
    // Supabase transactions are better but this works for now.
    return { error: 'Failed to create ledger entries' }
  }

  revalidatePath('/dashboard/journal')
  revalidatePath('/dashboard/ledger')
  revalidatePath('/dashboard/trial-balance')
  revalidatePath('/dashboard/financial-statements')
  
  return { success: true }
}
