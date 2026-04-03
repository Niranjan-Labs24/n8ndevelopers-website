"use server";

export async function submitToClickUp(formData: { name: string; email: string; business: string }) {
  const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
  const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;

  if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID) {
    console.error("Missing ClickUp credentials in .env");
    return { success: false, error: "Configuration Error: Missing ClickUp API credentials in .env file." };
  }

  const url = `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`;

  const taskData = {
    name: formData.business, 
    description: `Lead from Website Promotion Pop-up.`,
    status: "new lead",
    tags: ["lead", "coupon"],
    custom_fields: [
      {
        id: "6532f642-a0d2-4663-9645-cfa15c4c8d83", 
        value: formData.name
      },
      {
        id: "528e4265-7a98-4535-9be0-4894e5409d3d", 
        value: formData.email
      },
      {
        id: "bc416830-b0f3-4c53-b572-6a6ba76bad4a",
        value: "9227a702-eff6-411a-921f-79bad03982ae" 
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: CLICKUP_API_TOKEN,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ClickUp API Error details:", errorData);
      return { success: false, error: "Failed to create task in ClickUp. Check API token and List ID." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error connecting to ClickUp route:", error);
    return { success: false, error: "Internal server error connecting to ClickUp." };
  }
}
