//GET all toppings
const getAllToppings = async () => {
  try {
    const response = await fetch("/api/toppings");
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
const getAllSizes = async () => {
  try {
    const response = await fetch("/api/sizes");
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
const getAllCheeses = async () => {
  try {
    const response = await fetch("/api/cheeses");
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
const getAllSauces = async () => {
  try {
    const response = await fetch("/api/sauces");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching sauces:", error);
    return null;
  }
};
