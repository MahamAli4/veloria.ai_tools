const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:8000";
    }
    return "";
  }
  return (import.meta.env.VITE_API_URL || process.env.VITE_API_URL || "http://localhost:8000");
};
const BASE_URL = getBaseUrl();
const authCallbacks: Array<(event: string, session: any) => void> = [];

class DjangoClientBuilder {
  table: string;
  selectFields: string = "*";
  eqFilters: { [key: string]: any } = {};
  neqFilters: { [key: string]: any } = {};
  ordering: string = "";
  isSingle: boolean = false;
  payload: any = null;
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET";
  targetId: string | null = null;
  countOnly: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(fields: string = "*", options: any = {}) {
    this.selectFields = fields;
    if (options.head && options.count === "exact") {
      this.countOnly = true;
    }
    return this;
  }

  neq(field: string, value: any) {
    this.neqFilters[field] = value;
    return this;
  }

  eq(field: string, value: any) {
    if (field === "id" || field === "user_id") {
      this.targetId = value;
    }
    this.eqFilters[field] = value;
    return this;
  }

  order(field: string, options: any = {}) {
    const desc = options.ascending === false;
    this.ordering = desc ? `-${field}` : field;
    return this;
  }

  maybeSingle() {
    this.isSingle = true;
    return this;
  }

  insert(payload: any) {
    this.method = "POST";
    this.payload = payload;
    return this;
  }

  update(payload: any) {
    this.method = "PATCH";
    this.payload = payload;
    return this;
  }

  delete() {
    this.method = "DELETE";
    return this;
  }

  async execute() {
    // 1. Handle special Page View counts and active Tool counts via /api/stats/ view
    if (this.countOnly) {
      try {
        const res = await fetch(`${BASE_URL}/api/stats/`);
        if (!res.ok) throw new Error("Stats failed");
        const stats = await res.json();
        if (this.table === "tools") {
          return { count: stats.tools };
        } else if (this.table === "page_views") {
          return { count: stats.customers };
        }
      } catch (err) {
        console.error("Stats fetch failed, returning 0:", err);
        return { count: 0 };
      }
    }

    // 2. Handle mock admin role checks
    if (this.table === "user_roles" && this.method === "GET") {
      const token = localStorage.getItem("access_token");
      if (!token) return [];
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me/`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          if (user.is_admin) {
            const adminRole = { role: "admin" };
            return this.isSingle ? adminRole : [adminRole];
          }
        }
      } catch (err) {
        console.error("User role check failed:", err);
      }
      return this.isSingle ? null : [];
    }

    // 3. Map table name to API path
    let apiPath = "";
    if (this.table === "tools") apiPath = "/api/tools/";
    else if (this.table === "orders") apiPath = "/api/orders/";
    else if (this.table === "contact_messages") apiPath = "/api/contact/";
    else if (this.table === "testimonials") apiPath = "/api/testimonials/";
    else if (this.table === "page_views") apiPath = "/api/views/";
    else apiPath = `/api/${this.table}/`;

    // 4. Construct URL
    let url = `${BASE_URL}${apiPath}`;
    
    // For detail routes (PATCH, DELETE, or GET by ID)
    if (this.targetId && (this.method === "PATCH" || this.method === "DELETE")) {
      url = `${BASE_URL}${apiPath}${this.targetId}/`;
    }

    // Append query params for filtering/ordering on GET requests
    if (this.method === "GET") {
      const params = new URLSearchParams();
      if (this.ordering) {
        params.append("ordering", this.ordering);
      }
      // Add other filters as query parameters if needed
      for (const [k, v] of Object.entries(this.eqFilters)) {
        if (k !== "id" && k !== "user_id") {
          params.append(k, String(v));
        }
      }
      const queryStr = params.toString();
      if (queryStr) {
        url += `?${queryStr}`;
      }
    }

    // 5. Prepare headers (include JWT authorization token if present)
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 6. Send Request
    const fetchOptions: RequestInit = {
      method: this.method,
      headers,
    };
    if (this.payload) {
      fetchOptions.body = JSON.stringify(this.payload);
    }

    const res = await fetch(url, fetchOptions);

    if (this.method === "DELETE") {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Delete failed: ${res.status}`);
      }
      return null;
    }

    if (!res.ok) {
      const errText = await res.text();
      let message = `API request failed: ${res.status}`;
      try {
        const errObj = JSON.parse(errText);
        message = errObj.detail || errObj.error || message;
      } catch {}
      throw new Error(message);
    }

    const data = await res.json();

    // Map fields back to React format if needed
    if (this.table === "tools") {
      // Map list fields or duration if they differ, though DRF matches models.py 1:1
      const mapItem = (item: any) => ({
        ...item,
        // Make sure price floats are parsed
        original_price: Number(item.original_price),
        our_price: Number(item.our_price),
      });
      if (Array.isArray(data)) {
        return data.map(mapItem);
      }
      return mapItem(data);
    }

    return this.isSingle && Array.isArray(data) ? data[0] || null : data;
  }

  // Make the builder look like a Promise so that `await builder` works!
  then(onfulfilled?: any, onrejected?: any) {
    return this.execute()
      .then((data) => {
        const isCountObject = data && typeof data === "object" && "count" in data && !("data" in data);
        const result = {
          data: isCountObject ? null : data,
          error: null,
          count: data && typeof data === "object" && "count" in data ? (data as any).count : null,
        };
        return onfulfilled ? onfulfilled(result) : result;
      })
      .catch((err) => {
        console.error(`Supabase Client error [${this.table}]:`, err);
        const result = { data: null, error: err, count: null };
        if (onfulfilled) {
          return onfulfilled(result);
        }
        if (onrejected) {
          return onrejected(err);
        }
        throw err;
      });
  }
}

export const supabase = {
  auth: {
    async getSession() {
      const token = localStorage.getItem("access_token");
      if (!token) return { data: { session: null }, error: null };
      try {
        const userRes = await fetch(`${BASE_URL}/api/auth/me/`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!userRes.ok) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return { data: { session: null }, error: null };
        }
        const user = await userRes.json();
        return {
          data: {
            session: {
              access_token: token,
              user: {
                id: user.id,
                email: user.email,
                user_metadata: { name: user.username }
              }
            }
          },
          error: null
        };
      } catch {
        return { data: { session: null }, error: null };
      }
    },

    async getUser() {
      const token = localStorage.getItem("access_token");
      if (!token) return { data: { user: null }, error: new Error("No session token found") };
      try {
        const userRes = await fetch(`${BASE_URL}/api/auth/me/`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!userRes.ok) throw new Error("Unauthorized");
        const user = await userRes.json();
        return {
          data: {
            user: {
              id: user.id,
              email: user.email,
              user_metadata: { name: user.username }
            }
          },
          error: null
        };
      } catch (err) {
        return { data: { user: null }, error: err };
      }
    },

    async signInWithPassword({ email, password }: any) {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password })
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Authentication failed");
        }
        const tokens = await res.json();
        localStorage.setItem("access_token", tokens.access);
        localStorage.setItem("refresh_token", tokens.refresh);

        const { data: userData } = await this.getUser();
        authCallbacks.forEach(cb => cb("SIGNED_IN", { access_token: tokens.access, user: userData.user }));

        return { data: { user: userData.user }, error: null };
      } catch (err: any) {
        return { data: null, error: err };
      }
    },

    async signUp({ email, password }: any) {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/signup/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Signup failed");
        }
        const tokens = await res.json();
        localStorage.setItem("access_token", tokens.access);
        localStorage.setItem("refresh_token", tokens.refresh);

        const { data: userData } = await this.getUser();
        authCallbacks.forEach(cb => cb("SIGNED_IN", { access_token: tokens.access, user: userData.user }));

        return { data: { user: userData.user }, error: null };
      } catch (err: any) {
        return { data: null, error: err };
      }
    },

    async signOut() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      authCallbacks.forEach(cb => cb("SIGNED_OUT", null));
      return { error: null };
    },

    onAuthStateChange(callback: any) {
      authCallbacks.push(callback);
      // Immediately verify current session and trigger callback
      this.getSession().then(({ data }) => {
        if (data.session) {
          callback("SIGNED_IN", data.session);
        } else {
          callback("SIGNED_OUT", null);
        }
      });

      return {
        data: {
          subscription: {
            unsubscribe() {
              const idx = authCallbacks.indexOf(callback);
              if (idx !== -1) authCallbacks.splice(idx, 1);
            }
          }
        }
      };
    }
  },

  // Mock storage for file uploads compatibility (though we rewrite uploadImage directly)
  storage: {
    from() {
      return {
        async upload(path: string, file: any) {
          return { data: { path }, error: null };
        },
        async createSignedUrl(path: string) {
          return { data: { signedUrl: `${BASE_URL}/media/${path}` }, error: null };
        }
      };
    }
  },

  from(table: string) {
    return new DjangoClientBuilder(table);
  }
};
