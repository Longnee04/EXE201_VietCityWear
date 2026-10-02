export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus = "processing" | "completed" | "canceled";
export type UserRole = "user" | "admin";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      cities: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
        };
        Relationships: [];
      };
      landmarks: {
        Row: {
          id: string;
          city_id: string;
          name: string;
          story: string | null;
          images: string[];
          video_url: string | null;
          travel_timeline: string | null;
          food_suggestions: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          city_id: string;
          name: string;
          story?: string | null;
          images?: string[];
          video_url?: string | null;
          travel_timeline?: string | null;
          food_suggestions?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          city_id?: string;
          name?: string;
          story?: string | null;
          images?: string[];
          video_url?: string | null;
          travel_timeline?: string | null;
          food_suggestions?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          base_price: number;
          city_id: string | null;
          front_image: string | null;
          back_image: string | null;
          description: string | null;
          size_guide_text: string | null;
          package_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          base_price: number;
          city_id?: string | null;
          front_image?: string | null;
          back_image?: string | null;
          description?: string | null;
          size_guide_text?: string | null;
          package_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          base_price?: number;
          city_id?: string | null;
          front_image?: string | null;
          back_image?: string | null;
          description?: string | null;
          size_guide_text?: string | null;
          package_type?: string | null;
        };
        Relationships: [];
      };
      product_inventory: {
        Row: {
          id: string;
          product_id: string;
          size: string;
          color: string;
          stock_quantity: number;
          status: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          size: string;
          color: string;
          stock_quantity?: number;
          status?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          size?: string;
          color?: string;
          stock_quantity?: number;
          status?: boolean;
        };
        Relationships: [];
      };
      nfc_tags: {
        Row: {
          id: string;
          nfc_code: string;
          product_id: string | null;
          city_id: string | null;
          scan_count: number;
          experience_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nfc_code: string;
          product_id?: string | null;
          city_id?: string | null;
          scan_count?: number;
          experience_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nfc_code?: string;
          product_id?: string | null;
          city_id?: string | null;
          scan_count?: number;
          experience_url?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          receiver_name: string;
          receiver_phone: string;
          shipping_address: string;
          total_amount: number;
          payment_method: string;
          status: OrderStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          receiver_name: string;
          receiver_phone: string;
          shipping_address: string;
          total_amount: number;
          payment_method?: string;
          status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          receiver_name?: string;
          receiver_phone?: string;
          shipping_address?: string;
          total_amount?: number;
          payment_method?: string;
          status?: OrderStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          inventory_id: string;
          quantity: number;
          price_at_purchase: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          inventory_id: string;
          quantity?: number;
          price_at_purchase: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          inventory_id?: string;
          quantity?: number;
          price_at_purchase?: number;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          title: string;
          content: string;
          image_url: string | null;
          video_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          image_url?: string | null;
          video_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          image_url?: string | null;
          video_url?: string | null;
        };
        Relationships: [];
      };
      website_content: {
        Row: {
          id: string;
          page_name: string;
          content_body: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_name: string;
          content_body?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_name?: string;
          content_body?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      increment_nfc_scan: {
        Args: { tag_code: string };
        Returns: void;
      };
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
