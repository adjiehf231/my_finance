export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          currency: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          phone?: string | null
          currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          phone?: string | null
          currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      families: {
        Row: {
          id: string
          name: string
          invite_code: string
          status: 'active' | 'inactive'
          currency: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          invite_code: string
          status?: 'active' | 'inactive'
          currency?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string
          status?: 'active' | 'inactive'
          currency?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          is_active: boolean
          joined_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          is_active?: boolean
          joined_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          is_active?: boolean
          joined_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wallets: {
        Row: {
          id: string
          family_id: string
          user_id: string | null
          name: string
          type: 'cash' | 'bank' | 'ewallet' | 'credit_card' | 'investment' | 'other'
          initial_balance: number
          current_balance: number
          currency: string
          color: string
          icon: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id?: string | null
          name: string
          type: 'cash' | 'bank' | 'ewallet' | 'credit_card' | 'investment' | 'other'
          initial_balance?: number
          current_balance?: number
          currency?: string
          color?: string
          icon?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string | null
          name?: string
          type?: 'cash' | 'bank' | 'ewallet' | 'credit_card' | 'investment' | 'other'
          initial_balance?: number
          current_balance?: number
          currency?: string
          color?: string
          icon?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          family_id: string | null
          name: string
          type: 'income' | 'expense'
          icon: string
          color: string
          is_default: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          family_id?: string | null
          name: string
          type: 'income' | 'expense'
          icon?: string
          color?: string
          is_default?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string | null
          name?: string
          type?: 'income' | 'expense'
          icon?: string
          color?: string
          is_default?: boolean
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          family_id: string
          user_id: string
          wallet_id: string | null
          type: 'income' | 'expense' | 'transfer'
          category_id: string | null
          amount: number
          transaction_date: string
          description: string | null
          attachment_url: string | null
          from_wallet_id: string | null
          to_wallet_id: string | null
          is_recurring: boolean
          recurring_id: string | null
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          wallet_id?: string | null
          type: 'income' | 'expense' | 'transfer'
          category_id?: string | null
          amount: number
          transaction_date?: string
          description?: string | null
          attachment_url?: string | null
          from_wallet_id?: string | null
          to_wallet_id?: string | null
          is_recurring?: boolean
          recurring_id?: string | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          wallet_id?: string | null
          type?: 'income' | 'expense' | 'transfer'
          category_id?: string | null
          amount?: number
          transaction_date?: string
          description?: string | null
          attachment_url?: string | null
          from_wallet_id?: string | null
          to_wallet_id?: string | null
          is_recurring?: boolean
          recurring_id?: string | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          id: string
          family_id: string
          category_id: string
          period_month: string
          amount_limit: number
          notify_threshold: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          category_id: string
          period_month: string
          amount_limit: number
          notify_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          category_id?: string
          period_month?: string
          amount_limit?: number
          notify_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_goals: {
        Row: {
          id: string
          family_id: string
          user_id: string | null
          name: string
          target_amount: number
          current_amount: number
          target_date: string | null
          priority: 'low' | 'medium' | 'high'
          status: 'in_progress' | 'completed' | 'cancelled'
          icon: string
          color: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id?: string | null
          name: string
          target_amount: number
          current_amount?: number
          target_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'in_progress' | 'completed' | 'cancelled'
          icon?: string
          color?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string | null
          name?: string
          target_amount?: number
          current_amount?: number
          target_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'in_progress' | 'completed' | 'cancelled'
          icon?: string
          color?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      goal_contributions: {
        Row: {
          id: string
          goal_id: string
          family_id: string
          user_id: string
          wallet_id: string
          amount: number
          contribution_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          family_id: string
          user_id: string
          wallet_id: string
          amount: number
          contribution_date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          family_id?: string
          user_id?: string
          wallet_id?: string
          amount?: number
          contribution_date?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          id: string
          family_id: string
          user_id: string
          wallet_id: string
          category_id: string | null
          type: 'income' | 'expense'
          amount: number
          name: string
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date: string | null
          next_execution_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          wallet_id: string
          category_id?: string | null
          type: 'income' | 'expense'
          amount: number
          name: string
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date?: string | null
          next_execution_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          wallet_id?: string
          category_id?: string | null
          type?: 'income' | 'expense'
          amount?: number
          name?: string
          frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date?: string
          end_date?: string | null
          next_execution_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          id: string
          family_id: string
          user_id: string | null
          name: string
          type: 'debt_receivable' | 'loan_payable'
          total_amount: number
          remaining_amount: number
          interest_rate: number
          monthly_payment: number
          start_date: string
          due_date: string | null
          status: 'active' | 'settled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id?: string | null
          name: string
          type: 'debt_receivable' | 'loan_payable'
          total_amount: number
          remaining_amount: number
          interest_rate?: number
          monthly_payment?: number
          start_date: string
          due_date?: string | null
          status?: 'active' | 'settled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string | null
          name?: string
          type?: 'debt_receivable' | 'loan_payable'
          total_amount?: number
          remaining_amount?: number
          interest_rate?: number
          monthly_payment?: number
          start_date?: string
          due_date?: string | null
          status?: 'active' | 'settled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          family_id: string
          user_id: string | null
          title: string
          message: string
          type: 'budget_alert' | 'goal_milestone' | 'system' | 'reminder'
          is_read: boolean
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id?: string | null
          title: string
          message: string
          type?: 'budget_alert' | 'goal_milestone' | 'system' | 'reminder'
          is_read?: boolean
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: 'budget_alert' | 'goal_milestone' | 'system' | 'reminder'
          is_read?: boolean
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          id: string
          family_id: string
          user_id: string | null
          action: string
          entity: string
          entity_id: string | null
          description: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id?: string | null
          action: string
          entity: string
          entity_id?: string | null
          description: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string | null
          action?: string
          entity?: string
          entity_id?: string | null
          description?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_user_family_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_auth_user_role: {
        Args: { target_family_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
