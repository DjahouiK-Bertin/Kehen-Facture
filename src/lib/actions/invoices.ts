'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  tax_rate: z.number().min(0).optional(),
})

const invoiceSchema = z.object({
  client_id: z.string().uuid(),
  invoice_number: z.string().optional(),
  issue_date: z.string(),
  due_date: z.string(),
  subtotal: z.number().min(0),
  tax_total: z.number().min(0),
  discount_type: z.enum(['fixed', 'percentage']).optional(),
  discount: z.number().min(0).optional(),
  total: z.number().min(0),
  notes: z.string().optional(),
  payment_method: z.string().optional(),
  payment_details: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1),
})

export async function getInvoices() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated', data: [] }
  }

  // Fetch invoices with client info
  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select(`
      *,
      clients ( name, email, phone, address ),
      invoice_items ( * )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (invoicesError) {
    return { error: invoicesError.message, data: [] }
  }

  return { data: invoices }
}

export async function addInvoice(payload: any) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const parsed = invoiceSchema.safeParse(payload)
  
  if (!parsed.success) {
    return { error: 'Invalid data', details: parsed.error.flatten() }
  }

  // Use the RPC to get the next invoice number securely
  const currentYear = new Date().getFullYear()
  const { data: invNumber, error: rpcError } = await (supabase.rpc as any)('generate_next_invoice_number', { p_year: currentYear })
  
  if (rpcError) {
    return { error: rpcError.message }
  }

  // Fetch settings for issuer details
  const { data: settings } = await supabase.from('settings').select('*').eq('id', user.id).single()
  
  // Fetch client details
  const { data: client } = await supabase.from('clients').select('*').eq('id', parsed.data.client_id).single()

  if (!settings || !client) {
    return { error: 'Settings or client not found' }
  }

  // Insert Invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      client_id: parsed.data.client_id,
      invoice_number: `INV-${currentYear}-${invNumber.toString().padStart(4, '0')}`,
      issue_date: parsed.data.issue_date,
      due_date: parsed.data.due_date,
      issuer_name: (settings as any).company_name || 'My Company',
      issuer_email: (settings as any).company_email || user.email,
      issuer_phone: (settings as any).company_phone,
      issuer_address: (settings as any).company_address,
      client_name: (client as any).name,
      client_email: (client as any).email,
      client_phone: (client as any).phone,
      client_address: (client as any).address,
      subtotal: parsed.data.subtotal,
      tax_total: parsed.data.tax_total,
      discount_type: parsed.data.discount_type || 'fixed',
      discount: parsed.data.discount || 0,
      total: parsed.data.total,
      status: 'draft',
      notes: parsed.data.notes,
      payment_method: parsed.data.payment_method,
      payment_details: parsed.data.payment_details,
    } as any)
    .select()
    .single()

  if (invoiceError) {
    return { error: invoiceError.message }
  }

  // Insert Invoice Items
  const itemsToInsert = parsed.data.items.map(item => {
    const taxRate = item.tax_rate || 0;
    const ht = item.quantity * item.unit_price;
    const amount = ht * (1 + taxRate / 100);
    return {
      user_id: user.id,
      invoice_id: (invoice as any).id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      amount: amount,
      tax_rate: taxRate
    }
  })

  const { error: itemsError } = await supabase
    .from('invoice_items')
    // @ts-ignore
    .insert(itemsToInsert as any[])

  if (itemsError) {
    // Ideally we should rollback or use a true RPC transaction if we want atomicity for invoice + items
    return { error: itemsError.message }
  }

  revalidatePath('/dashboard/invoices')
  return { success: true, invoiceId: (invoice as any).id }
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/invoices')
  return { success: true }
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('invoices')
    // @ts-ignore
    .update({ status } as any)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/invoices')
  return { success: true }
}

export async function getInvoiceById(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients ( name, email, phone, address ),
      invoice_items ( * )
    `)
    .eq('user_id', user.id)
    .eq('id', id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data: invoice }
}

export async function updateInvoice(id: string, formData: any) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const parsed = invoiceSchema.safeParse(formData)
  
  if (!parsed.success) {
    return { error: 'Invalid data', details: parsed.error.format() }
  }

  // Fetch client details if client_id is provided
  let clientDetails: any = null;
  if (parsed.data.client_id) {
    const { data: client } = await supabase
      .from('clients')
      .select('name, email, phone, address')
      .eq('id', parsed.data.client_id)
      .single()
    clientDetails = client
  }

  // Calculate totals
  const subtotal = parsed.data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  let taxTotal = 0;
  parsed.data.items.forEach(item => {
    const taxRate = item.tax_rate || 0;
    const itemHt = item.quantity * item.unit_price;
    taxTotal += itemHt * (taxRate / 100);
  });
  
  let discountAmount = parsed.data.discount || 0;
  if (parsed.data.discount_type === 'percentage') {
    discountAmount = (subtotal + taxTotal) * ((parsed.data.discount || 0) / 100);
  }
  
  const total = subtotal + taxTotal - discountAmount;

  const updateData: any = {
    client_id: parsed.data.client_id,
    issue_date: parsed.data.issue_date,
    due_date: parsed.data.due_date,
    client_name: clientDetails?.name || null,
    client_email: clientDetails?.email || null,
    client_phone: clientDetails?.phone || null,
    client_address: clientDetails?.address || null,
    subtotal,
    tax_total: taxTotal,
    discount_type: parsed.data.discount_type,
    discount: parsed.data.discount || 0,
    total: total,
    notes: parsed.data.notes,
    payment_method: parsed.data.payment_method,
    payment_details: parsed.data.payment_details,
    updated_at: new Date().toISOString()
  };

  if ((formData as any).status) {
    updateData.status = (formData as any).status;
  }

  // Update Invoice
  const { error: invoiceError } = await supabase
    .from('invoices')
    // @ts-ignore
    .update(updateData as any)
    .eq('id', id)
    .eq('user_id', user.id)

  if (invoiceError) {
    return { error: invoiceError.message }
  }

  // Delete existing items
  await supabase
    .from('invoice_items')
    .delete()
    .eq('invoice_id', id)
    .eq('user_id', user.id)

  // Insert new Invoice Items
  if (parsed.data.items && parsed.data.items.length > 0) {
    const itemsToInsert = parsed.data.items.map(item => {
      const taxRate = item.tax_rate || 0;
      const ht = item.quantity * item.unit_price;
      const amount = ht * (1 + taxRate / 100);
      return {
        user_id: user.id,
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: amount,
        tax_rate: taxRate
      }
    })

    const { error: itemsError } = await supabase
      .from('invoice_items')
      // @ts-ignore
      .insert(itemsToInsert as any[])

    if (itemsError) {
      return { error: itemsError.message }
    }
  }

  revalidatePath('/dashboard/invoices')
  return { success: true }
}
