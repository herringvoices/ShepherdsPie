//GET all user profiles
const getAllUserProfiles = async () => {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};
//GET user profile by id
const getUserProfileById = async (id) => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
