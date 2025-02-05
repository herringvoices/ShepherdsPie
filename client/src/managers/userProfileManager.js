//GET all user profiles
export const getAllUserProfiles = async () => {
  try {
    const response = await fetch("/api/userprofile");
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
export const getUserProfileById = async (id) => {
  try {
    const response = await fetch(`/api/userprofile/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

//DELETE user profile
export const deleteUserProfile = async (userId) => {
  try {
    const response = await fetch(`/api/userprofile/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting user", error);
    return null;
  }
};
