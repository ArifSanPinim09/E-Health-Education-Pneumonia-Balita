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
      mother_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          religion: string
          occupation: string
          address: string
          phone: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          religion: string
          occupation: string
          address: string
          phone: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number
          religion?: string
          occupation?: string
          address?: string
          phone?: string
          created_at?: string
        }
      }
      child_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          birth_date: string
          gender: 'male' | 'female'
          age_years: number
          age_months: number
          age_days: number
          assessment_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          birth_date: string
          gender: 'male' | 'female'
          age_years: number
          age_months: number
          age_days: number
          assessment_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          birth_date?: string
          gender?: 'male' | 'female'
          age_years?: number
          age_months?: number
          age_days?: number
          assessment_date?: string
          created_at?: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          question_text: string
          correct_answer: boolean
          order_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_text: string
          correct_answer: boolean
          order_number: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_text?: string
          correct_answer?: boolean
          order_number?: number
          created_at?: string
          updated_at?: string
        }
      }
      test_submissions: {
        Row: {
          id: string
          user_id: string
          test_type: 'pre' | 'post'
          answers: Json
          score: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_type: 'pre' | 'post'
          answers: Json
          score: number
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          test_type?: 'pre' | 'post'
          answers?: Json
          score?: number
          completed_at?: string
        }
      }
      session_progress: {
        Row: {
          id: string
          user_id: string
          day: number
          completed: boolean
          completed_at: string | null
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          day: number
          completed?: boolean
          completed_at?: string | null
          unlocked_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          day?: number
          completed?: boolean
          completed_at?: string | null
          unlocked_at?: string
          created_at?: string
        }
      }
      session_content: {
        Row: {
          id: string
          day: number
          title: string
          content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day: number
          title: string
          content: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day?: number
          title?: string
          content?: Json
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          created_at?: string
        }
      }
      otp_codes: {
        Row: {
          id: string
          email: string
          code: string
          expires_at: string
          used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          code: string
          expires_at: string
          used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          code?: string
          expires_at?: string
          used?: boolean
          created_at?: string
        }
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
  }
}

// Helper types for application use
export type MotherProfile = Database['public']['Tables']['mother_profiles']['Row']
export type ChildProfile = Database['public']['Tables']['child_profiles']['Row']
export type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row']
export type TestSubmission = Database['public']['Tables']['test_submissions']['Row']
export type SessionProgress = Database['public']['Tables']['session_progress']['Row']
export type SessionContent = Database['public']['Tables']['session_content']['Row']
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type OTPCode = Database['public']['Tables']['otp_codes']['Row']
