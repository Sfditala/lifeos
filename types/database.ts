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
    PostgrestVersion: "14.15"
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
      content_items: {
        Row: {
          created_at: string | null
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
      goals: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          life_area_id: string | null
          status: string
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          life_area_id?: string | null
          status?: string
          target_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          life_area_id?: string | null
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
          frequency: string
          id: string
          life_area_id: string | null
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          frequency?: string
          id?: string
          life_area_id?: string | null
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
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
          id: string
          name: string
          sort_order: number | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          sort_order?: number | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          goal_id: string | null
          id: string
          life_area_id: string
          name: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          goal_id?: string | null
          id?: string
          life_area_id: string
          name: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          goal_id?: string | null
          id?: string
          life_area_id?: string
          name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
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
          completed_at: string | null
          created_at: string | null
          due_date: string | null
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
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
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
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
