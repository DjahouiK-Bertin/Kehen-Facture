'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  type: z.enum(['income', 'expense']),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
  date: z.string().optional(),
})

export async function getTransactions() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated', data: [] }
  }

  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (transactionsError) {
    return { error: transactionsError.message, data: [] }
  }

  return { data: transactions }
}

export async function addTransaction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const payload = {
    description: formData.get('description') as string,
    amount: parseFloat(formData.get('amount') as string || '0'),
    type: formData.get('type') as string,
    status: 'completed', // Default for manual transactions for now
    date: formData.get('date') as string,
  }

  const parsed = transactionSchema.safeParse(payload)
  
  if (!parsed.success) {
    return { error: 'Invalid data', details: parsed.error.flatten() }
  }

  const { error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      description: parsed.data.description,
      amount: parsed.data.amount,
      type: parsed.data.type,
      status: parsed.data.status,
      date: parsed.data.date || new Date().toISOString().split('T')[0],
    } as any)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/transactions')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/transactions')
  return { success: true }
}
