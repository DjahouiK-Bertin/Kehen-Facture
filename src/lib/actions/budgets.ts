'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const budgetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  total_limit: z.number().min(0, 'Amount must be positive'),
  color: z.string().optional(),
})

export async function getBudgets() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated', data: [] }
  }

  const { data: budgets, error: budgetsError } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (budgetsError) {
    return { error: budgetsError.message, data: [] }
  }

  return { data: budgets }
}

export async function addBudget(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const payload = {
    name: formData.get('name') as string,
    total_limit: parseFloat(formData.get('total_limit') as string || '0'),
    color: formData.get('color') as string,
  }

  const parsed = budgetSchema.safeParse(payload)
  
  if (!parsed.success) {
    return { error: 'Invalid data', details: parsed.error.flatten() }
  }

  const { error } = await supabase
    .from('budgets')
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      total_limit: parsed.data.total_limit,
      color: parsed.data.color || 'bg-blue-500',
    } as any)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/budgeting')
  return { success: true }
}

export async function deleteBudget(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/budgeting')
  return { success: true }
}
