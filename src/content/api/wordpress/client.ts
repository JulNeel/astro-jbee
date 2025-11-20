const WP_API_URL = import.meta.env.PUBLIC_WP_URL + '/wp-json';

export const wpClient = {
  async request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${WP_API_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API Error: ${response.statusText}`);
    }

    return response.json();
  }
};