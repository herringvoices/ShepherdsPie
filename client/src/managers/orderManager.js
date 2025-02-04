//fetches orders by date. Accepts dates as a string in YYYY-MM-DD format
export async function getOrdersByDate(date) {
  try {
    const response = await fetch(
      `/api/orders?date=${encodeURIComponent(date)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
}

//fetch order by id
export async function getOrderById(id) {
  try {
    const response = await fetch(`/api/orders/${id}`);
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

//creates a new order
export async function createOrder(order) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
}

//updates an order
export async function updateOrder(order) {
  try {
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order:", error);
    return null;
  }
}
//deletes an order
export async function deleteOrder(id) {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting order:", error);
    return null;
  }
}
