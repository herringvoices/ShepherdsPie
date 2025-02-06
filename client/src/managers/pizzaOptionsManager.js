//GET all toppings
export const getAllToppings = async () => {
  try {
    const response = await fetch("/api/topping");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching toppings:", error);
    return null;
  }
};
//GET all sizes
export const getAllSizes = async () => {
  try {
    const response = await fetch("/api/size");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return null;
  }
};
//GET all cheeses
export const getAllCheeses = async () => {
  try {
    const response = await fetch("/api/cheese");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cheeses:", error);
    return null;
  }
};
//GET all sauces
export const getAllSauces = async () => {
  try {
    const response = await fetch("/api/sauce");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching sauces:", error);
    return null;
  }
};
