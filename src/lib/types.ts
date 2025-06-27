
export interface CardType {
  id: string;
  user_id: string;
  membership_type: number;
  membership_start: string | null;
  membership_end: string | null;
  data: {
    name?: string;
    profession?: string;
    bio?: string;
    profileImage?: string;
    bannerImage?:string;
    email?: string;
    phone?: string;
    address?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
    // Add any other custom fields you might store in the JSON data
  };
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceType {
  id?: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
}



export type CardDataType = {
  name?: string;
  profession?: string;
  bio?: string;
  profileImage?: string;
  bannerImage?: string;
  email?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
};

// export type CardType = {
//   id: string;
//   data: CardDataType;
//   services?: ServiceType[];
// };

export type BookingData = {
  name: string;
  phone: string;
  serviceId: string;
  message: string;
};

export type StatusType = 
  | "loading" 
  | "not_found" 
  | "inactive" 
  | "loaded" 
  | "error";