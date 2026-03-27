import { createClient } from '@/utils/supabase/server'
import FinancialStatementsClient from '@/components/FinancialStatementsClient'

export default async function FinancialStatementsPage() {
  const supabase = await createClient()

  const { data: ledgerEntries } = await supabase
    .from('ledger_entries')
    .select('*')

  // Calculate balances per account
  const accountBalances: Record<string, { account: string, debit: number, credit: number }> = {}
  ledgerEntries?.forEach((entry) => {
    if (!accountBalances[entry.account_name]) {
      accountBalances[entry.account_name] = { account: entry.account_name, debit: 0, credit: 0 }
    }
    accountBalances[entry.account_name].debit += Number(entry.debit)
    accountBalances[entry.account_name].credit += Number(entry.credit)
  })

  const accounts = Object.values(accountBalances)

  return (
    <>
      <h1 className="page-title">Financial Statements</h1>
      <p className="page-subtitle">The final output of the accounting process.</p>
      
      <FinancialStatementsClient accounts={accounts} />
    </>
  )
}
