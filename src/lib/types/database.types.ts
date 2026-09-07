export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          company_name: string
          company_email: string
          company_phone: string | null
          company_address: string | null
          currency: string
          default_tax_rate: number
          default_payment_terms: string | null
          default_payment_method: string | null
          default_payment_details: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name: string
          company_email: string
          company_phone?: string | null
          company_address?: string | null
          currency?: string
          default_tax_rate?: number
          default_payment_terms?: string | null
          default_payment_method?: string | null
          default_payment_details?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          company_email?: string
          company_phone?: string | null
          company_address?: string | null
          currency?: string
          default_tax_rate?: number
          default_payment_terms?: string | null
          default_payment_method?: string | null
          default_payment_details?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          ifu: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          ifu?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          ifu?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          name: string
          total_limit: number
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          total_limit: number
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          total_limit?: number
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          client_id: string
          invoice_number: string
          status: 'draft' | 'sent' | 'pending' | 'paid' | 'cancelled' | 'overdue'
          issue_date: string
          due_date: string
          issuer_name: string
          issuer_email: string
          issuer_phone: string | null
          issuer_address: string | null
          client_name: string
          client_email: string | null
          client_phone: string | null
          client_address: string | null
          subtotal: number
          tax_total: number
          discount_type: 'fixed' | 'percentage'
          discount: number
          total: number
          notes: string | null
          payment_method: string | null
          payment_details: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          invoice_number: string
          status?: 'draft' | 'sent' | 'pending' | 'paid' | 'cancelled' | 'overdue'
          issue_date: string
          due_date: string
          issuer_name: string
          issuer_email: string
          issuer_phone?: string | null
          issuer_address?: string | null
          client_name: string
          client_email?: string | null
          client_phone?: string | null
          client_address?: string | null
          subtotal?: number
          tax_total?: number
          discount_type?: 'fixed' | 'percentage'
          discount?: number
          total?: number
          notes?: string | null
          payment_method?: string | null
          payment_details?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          invoice_number?: string
          status?: 'draft' | 'sent' | 'pending' | 'paid' | 'cancelled' | 'overdue'
          issue_date?: string
          due_date?: string
          issuer_name?: string
          issuer_email?: string
          issuer_phone?: string | null
          issuer_address?: string | null
          client_name?: string
          client_email?: string | null
          client_phone?: string | null
          client_address?: string | null
          subtotal?: number
          tax_total?: number
          discount_type?: 'fixed' | 'percentage'
          discount?: number
          total?: number
          notes?: string | null
          payment_method?: string | null
          payment_details?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          user_id: string
          description: string
          quantity: number
          unit_price: number
          tax_rate: number
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          user_id: string
          description: string
          quantity?: number
          unit_price?: number
          tax_rate?: number
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          user_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          tax_rate?: number
          amount?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          invoice_id: string | null
          budget_id: string | null
          date: string
          description: string
          amount: number
          type: 'income' | 'expense'
          status: 'completed' | 'pending' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_id?: string | null
          budget_id?: string | null
          date: string
          description: string
          amount: number
          type: 'income' | 'expense'
          status?: 'completed' | 'pending' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_id?: string | null
          budget_id?: string | null
          date?: string
          description?: string
          amount?: number
          type?: 'income' | 'expense'
          status?: 'completed' | 'pending' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      invoice_sequences: {
        Row: {
          user_id: string
          year: number
          last_value: number
        }
        Insert: {
          user_id: string
          year: number
          last_value?: number
        }
        Update: {
          user_id?: string
          year?: number
          last_value?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_next_invoice_number: {
        Args: {
          p_year: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
