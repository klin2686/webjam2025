const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string | null;
    email_verified: boolean;
    profile_picture: string | null;
    created_at: string;
    has_password: boolean;
    has_google_auth: boolean;
  };
  access_token: string;
  refresh_token: string;
}

export interface ErrorResponse {
  error: string;
}

export class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        response.status,
        data.error || 'An error occurred'
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  googleAuth: async (token: string): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    return fetchAPI<{ access_token: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  getCurrentUser: async (accessToken: string): Promise<{ user: AuthResponse['user'] }> => {
    return fetchAPI<{ user: AuthResponse['user'] }>('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

export const storage = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },

  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  setUser: (user: AuthResponse['user']) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: (): AuthResponse['user'] | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  clearUser: () => {
    localStorage.removeItem('user');
  },

  clearAll: () => {
    storage.clearTokens();
    storage.clearUser();
  },
};

// Menu Processing API

export interface MenuItem {
  item_name: string;
  common_allergens: string[];
  confidence_score: number;
}

export interface MenuHistoryItem {
  id: number;
  user_id: number;
  upload_name: string;
  analysis_result: MenuItem[];
  created_at: string;
}

export type MenuProcessResponse = MenuItem[];

export const menuAPI = {
  processMenuImage: async (accessToken: string, imageFile: File): Promise<MenuProcessResponse> => {
    const formData = new FormData();
    formData.append('menu_image', imageFile);

    const url = `${API_BASE_URL}/process-menu`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new APIError(
          response.status,
          data.error || 'Failed to process menu image'
        );
      }

      return data as MenuProcessResponse;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  processManualInput: async (accessToken: string, menuName: string, menuItems: string[]): Promise<MenuProcessResponse> => {
    return fetchAPI<MenuProcessResponse>('/process-manual-input', {
      method: 'POST',
      body: JSON.stringify({ menu_name: menuName, menu_items: menuItems }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getMenuHistory: async (accessToken: string): Promise<MenuHistoryItem[]> => {
    return fetchAPI<MenuHistoryItem[]>('/menu-uploads', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

// Allergy API
export interface AllergyItem {
  id: number;
  user_id: number;
  allergen_id: number;
  allergen_name: string;
  severity: number;
}

export interface AllergyResponse {
  message: string;
  user_allergy: AllergyItem[];
}

export interface AddAllergyResponse {
  message: string;
  user_allergy: {
    id: number;
    user_id: number;
    allergen_id: number;
    severity: number;
    allergen_name: string;
  };
}

export const allergyAPI = {
  getAllergies: async (accessToken: string): Promise<AllergyResponse> => {
    return fetchAPI<AllergyResponse>('/allergy/get', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  addAllergy: async (
    accessToken: string,
    allergenName: string,
    severity: number
  ): Promise<AddAllergyResponse> => {
    return fetchAPI<AddAllergyResponse>('/allergy/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        allergen_name: allergenName.toLowerCase(),
        severity: severity,
      }),
    });
  },

  deleteAllergy: async (
    accessToken: string,
    allergyId: number
  ): Promise<{ message: string }> => {
    return fetchAPI<{ message: string }>('/allergy/delete', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        user_allergy_id: allergyId,
      }),
    });
  },
};