'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const settingsSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  company_email: z.string().email('Invalid email'),
  company_phone: z.string().optional(),
  company_address: z.string().optional(),
  currency: z.string().min(1),
  default_tax_rate: z.number().min(0).max(100),
  default_payment_terms: z.string().optional(),
})

export async function getSettings() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('*')
    .eq('id', user.id)
    .single()

  if (settingsError) {
    return { error: settingsError.message }
  }

  return { data: settings }
}

export async function updateSettings(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const payload = {
    company_name: formData.get('company_name') as string,
    company_email: formData.get('company_email') as string,
    company_phone: formData.get('company_phone') as string,
    company_address: formData.get('company_address') as string,
    currency: formData.get('currency') as string,
    default_tax_rate: parseFloat(formData.get('default_tax_rate') as string || '0'),
    default_payment_terms: formData.get('default_payment_terms') as string,
  }

  const parsed = settingsSchema.safeParse(payload)
  
  if (!parsed.success) {
    return { error: 'Invalid data', details: parsed.error.flatten() }
  }

  const { error } = await supabase
    .from('settings')
    // @ts-ignore
    .update(parsed.data as any)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
