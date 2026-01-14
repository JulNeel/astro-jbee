const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;

export const strapiClient = {
  async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${STRAPI_URL}/api${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Strapi API Error: ${response.statusText}`);
    }

    return response.json();
  },
};
