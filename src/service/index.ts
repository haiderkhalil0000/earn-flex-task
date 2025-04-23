import axios from "axios";

const getActivationCode = async () => {
  try {
    const response = await axios.post(
      "https://api.findofficers.com/hiring_test/get_activation_code"
    );

    if (response.status === 200) {
      return response?.data?.activationCode;
    }
  } catch (error) {
    console.error("Error fetching activation code:", error);
    throw new Error("Failed to fetch activation code");
  }
};

export const getEmployees = async () => {
  try {
    const activationCode = await getActivationCode();
    const response = await axios.post(
      "https://api.findofficers.com/hiring_test/get_all_employee",
      {
        activationCode: activationCode,
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Failed to fetch employees");
  }
};

export const addEmployee = async (formData: any) => {
  try {
    const activationCode = await getActivationCode();
    const response = await axios.post(
      "https://api.findofficers.com/hiring_test/add_employee",
      {
        ...formData,
        activationCode: activationCode,
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error adding employee:", error);
    throw new Error("Failed to fetch employees");
  }
};