export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      budgets: {
        Row: {
          category: string
          created_at: string | null
          deleted_at: string | null
          id: string
          life_area_id: string | null
          monthly_limit: number
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          life_area_id?: string | null
          monthly_limit: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          life_area_id?: string | null
          monthly_limit?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          founded_date: string | null
          id: string
          industry: string | null
          name: string
          owner_user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          founded_date?: string | null
          id?: string
          industry?: string | null
          name: string
          owner_user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          founded_date?: string | null
          id?: string
          industry?: string | null
          name?: string
          owner_user_id?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          life_area_id: string | null
          notes: string | null
          project_id: string | null
          scheduled_date: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          life_area_id?: string | null
          notes?: string | null
          project_id?: string | null
          scheduled_date?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          life_area_id?: string | null
          notes?: string | null
          project_id?: string | null
          scheduled_date?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          related_project_id: string | null
          review_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          related_project_id?: string | null
          review_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          related_project_id?: string | null
          review_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decisions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          company_id: string | null
          deleted_at: string | null
          file_name: string
          file_type: string | null
          id: string
          life_area_id: string | null
          project_id: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          deleted_at?: string | null
          file_name: string
          file_type?: string | null
          id?: string
          life_area_id?: string | null
          project_id?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          deleted_at?: string | null
          file_name?: string
          file_type?: string | null
          id?: string
          life_area_id?: string | null
          project_id?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_links: {
        Row: {
          created_at: string | null
          from_id: string
          from_type: string
          id: string
          relation_label: string | null
          to_id: string
          to_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          from_id: string
          from_type: string
          id?: string
          relation_label?: string | null
          to_id: string
          to_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          from_id?: string
          from_type?: string
          id?: string
          relation_label?: string | null
          to_id?: string
          to_type?: string
          user_id?: string
        }
        Relationships: []
      }
      finance_accounts: {
        Row: {
          created_at: string | null
          currency: string
          deleted_at: string | null
          id: string
          name: string
          opening_balance: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          id?: string
          name: string
          opening_balance?: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          id?: string
          name?: string
          opening_balance?: number
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_goals: {
        Row: {
          created_at: string | null
          current_amount: number
          deleted_at: string | null
          id: string
          target_amount: number
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_amount?: number
          deleted_at?: string | null
          id?: string
          target_amount: number
          target_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_amount?: number
          deleted_at?: string | null
          id?: string
          target_amount?: number
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          life_area_id: string | null
          parent_goal_id: string | null
          period_end: string | null
          period_start: string | null
          period_type: string
          status: string
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          life_area_id?: string | null
          parent_goal_id?: string | null
          period_end?: string | null
          period_start?: string | null
          period_type?: string
          status?: string
          target_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          life_area_id?: string | null
          parent_goal_id?: string | null
          period_end?: string | null
          period_start?: string | null
          period_type?: string
          status?: string
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_parent_goal_id_fkey"
            columns: ["parent_goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          created_at: string | null
          done: boolean
          habit_id: string
          id: string
          log_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          done?: boolean
          habit_id: string
          id?: string
          log_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          done?: boolean
          habit_id?: string
          id?: string
          log_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          active: boolean
          created_at: string | null
          deleted_at: string | null
          frequency: string
          id: string
          life_area_id: string | null
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          deleted_at?: string | null
          frequency?: string
          id?: string
          life_area_id?: string | null
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          deleted_at?: string | null
          frequency?: string
          id?: string
          life_area_id?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_notes: {
        Row: {
          body: string
          created_at: string | null
          deleted_at: string | null
          id: string
          life_area_id: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          life_area_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          life_area_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_notes_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      life_areas: {
        Row: {
          color: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          show_files: boolean
          show_meetings: boolean
          sort_order: number | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          show_files?: boolean
          show_meetings?: boolean
          sort_order?: number | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          show_files?: boolean
          show_meetings?: boolean
          sort_order?: number | null
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          ends_at: string | null
          id: string
          life_area_id: string | null
          location: string | null
          notes: string | null
          project_id: string | null
          starts_at: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          ends_at?: string | null
          id?: string
          life_area_id?: string | null
          location?: string | null
          notes?: string | null
          project_id?: string | null
          starts_at: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          ends_at?: string | null
          id?: string
          life_area_id?: string | null
          location?: string | null
          notes?: string | null
          project_id?: string | null
          starts_at?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          done: boolean
          due_date: string | null
          id: string
          project_id: string
          sort_order: number | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          done?: boolean
          due_date?: string | null
          id?: string
          project_id: string
          sort_order?: number | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          done?: boolean
          due_date?: string | null
          id?: string
          project_id?: string
          sort_order?: number | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          company_id: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          goal_id: string | null
          id: string
          life_area_id: string
          name: string
          status: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          goal_id?: string | null
          id?: string
          life_area_id: string
          name: string
          status?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          goal_id?: string | null
          id?: string
          life_area_id?: string
          name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      review_items: {
        Row: {
          content: string
          id: string
          kind: string
          review_id: string
        }
        Insert: {
          content: string
          id?: string
          kind: string
          review_id: string
        }
        Update: {
          content?: string
          id?: string
          kind?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_items_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string | null
          id: string
          period_end: string
          period_start: string
          summary: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          period_end: string
          period_start: string
          summary?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          period_end?: string
          period_start?: string
          summary?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          deleted_at: string | null
          due_date: string | null
          duration_minutes: number | null
          id: string
          life_area_id: string
          notes: string | null
          priority: string
          project_id: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          life_area_id: string
          notes?: string | null
          priority?: string
          project_id?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          life_area_id?: string
          notes?: string | null
          priority?: string
          project_id?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          company_id: string
          email: string
          id: string
          invited_at: string | null
          joined_at: string | null
          position: string
          role: string
          status: string
          user_id: string | null
        }
        Insert: {
          company_id: string
          email: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          position?: string
          role?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string
          email?: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          position?: string
          role?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category: string | null
          created_at: string | null
          deleted_at: string | null
          direction: string
          id: string
          is_recurring: boolean
          life_area_id: string | null
          note: string | null
          occurred_at: string
          project_id: string | null
          recurrence_rule: string | null
          source: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          category?: string | null
          created_at?: string | null
          deleted_at?: string | null
          direction: string
          id?: string
          is_recurring?: boolean
          life_area_id?: string | null
          note?: string | null
          occurred_at: string
          project_id?: string | null
          recurrence_rule?: string | null
          source?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          category?: string | null
          created_at?: string | null
          deleted_at?: string | null
          direction?: string
          id?: string
          is_recurring?: boolean
          life_area_id?: string | null
          note?: string | null
          occurred_at?: string
          project_id?: string | null
          recurrence_rule?: string | null
          source?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "finance_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_life_area_id_fkey"
            columns: ["life_area_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          accent_color: string | null
          display_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accent_color?: string | null
          display_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accent_color?: string | null
          display_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_active_company_member: {
        Args: { target_company_id: string; target_user_id: string }
        Returns: boolean
      }
      is_company_owner: {
        Args: { target_company_id: string; target_user_id: string }
        Returns: boolean
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
