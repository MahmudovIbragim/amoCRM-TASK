/* eslint-disable @typescript-eslint/no-explicit-any */
// script.ts
interface Lead {
  id: number;
  name: string;
  price: number;
  responsible_user_id: number;
  group_id: number;
  status_id: number;
  pipeline_id: number;
  loss_reason_id: any;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  closed_at: any;
  closest_task_at: number;
  is_deleted: boolean;
  custom_fields_values: any;
  score: any;
  account_id: number;
  labor_cost: any;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded: {
    tags: any[];
    companies: [
      {
        id: number;
        _links: {
          self: {
            href: string;
          };
        };
      }
    ];
  };
}
const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
const token = JSON.parse(localStorage.getItem("response")!);

export const getLeads = async (): Promise<Lead[] | undefined> => {
  try {
    const response = await fetch(
      `${proxyUrl}https://ibrahimorunbaev59.amocrm.ru/api/v4/leads`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("server err", response.status, errorData);
      return;
    }

    const data = await response.json();
    console.log("Deals:", data);
    return data._embedded.leads; 
  } catch (error) {
    console.error("error", error);
  }
};

export const fetchLeadsWithRateLimit = async () => {
  const maxRequestsPerSecond = 3;
  const interval = 1000 / maxRequestsPerSecond;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchBatch = async (offset = 0) => {
    try {
      const response = await fetch(
        `${proxyUrl}https://ibrahimorunbaev59.amocrm.ru/api/v4/leads?offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("server err", response.status, errorData);
        return;
      }

      const data = await response.json();
      console.log("response", data);

      if (data._embedded.leads) {
        return data._embedded.leads;
      }

      if (data.next_page) {
        await delay(interval);
        return await fetchBatch(data.next_page_offset);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return await fetchBatch();
};

export const getLeadDetails = async (leadId: number) => {
  if (!token) {
    console.error("Token not found in localStorage");
    return;
  }

  const proxyUrl = "https://thingproxy.freeboard.io/fetch/";

  try {
    const response = await fetch(
      `${proxyUrl}https://ibrahimorunbaev59.amocrm.ru/api/v4/leads/${leadId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("server error", response.status, errorData);
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(" Error", error);
  }
};
