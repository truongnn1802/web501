import { baseUrl } from "./constant.js";
import { showToast } from "../app.js";

export class Http {
  constructor(endpoint) {
    this.baseUrl = baseUrl;
    this.endpoint = endpoint;
  }
  async get(id = null) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.endpoint}${id ? `/${id}` : ""}`
      );
      console.log(response);
      return await response.json();
    } catch (error) {
      return console.error(`Error fetching data from ${this.endpoint}:`, error);
    }
  }
  async post(data, toast, fn = null) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response
        .json()
        .then((data) => {
          if (toast) showToast("Thêm mới thành công");
          if (fn) fn();
          return data;
        })
        .catch((err) => {
          if (toast) showToast("Thêm không thành công");
        });
    } catch (error) {
      if (toast) showToast("Thêm không thành công");
      return console.error(`Error posting data to ${this.endpoint}:`, error);
    }
  }
  async update(id, data, toast) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      response
        .json()
        .then((data) => {
          if (toast) showToast("Thêm mới thành công");
          if (fn) fn();
          return data;
        })
        .catch((err) => {
          if (toast) showToast("Thêm không thành công");
        });
    } catch (error) {
      if (toast) showToast("Thêm không thành công");
      return console.error(`Error posting data to ${this.endpoint}:`, error);
    }
  }
  async remove(id, toast) {
    console.log(id);
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}/${id}`, {
        method: "DELETE",
      });
      response
        .json()
        .then((data) => {
          if (toast) showToast("Xóa thành công");
          fn();
        })
        .catch((err) => {
          if (toast) showToast("Xóa không thành công");
        });
    } catch (error) {
      if (toast) showToast("Xóa không thành công");
      return console.error(`Error deleting data from ${this.endpoint}:`, error);
    }
  }

  async updateData(id, data) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return console.error(`Error updating data in ${this.endpoint}:`, error);
    }
  }

  async query(query, toast) {
    try {
      const queryString = Object.keys(query)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
        )
        .join("&");
      const fullUrl = `${this.baseUrl}/${this.endpoint}?${queryString}`;
      console.log(fullUrl);
      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
      // Handle the data from the server
    } catch (error) {
      console.error("Error during fetch:", error);
      // Handle errors, if any
    }
  }

  async performSearch(search) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.endpoint}`);
      const data = await response.json();
      const result_1 = data.filter((item) => fuzzySearch(item, search));
      console.log(result_1);
      return result_1;
    } catch (error) {
      return console.error("Error during search:", error);
    }
  }
  fuzzySearch(item, term) {
    // Custom fuzzy search logic
    const newItem = { name: item.name };
    console.log(newItem);
    for (const key in newItem) {
      if (newItem[key].toString().toLowerCase().includes(term.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
}

export const getData = async (endpoint) => {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`);
    return await response.json();
  } catch (error) {
    return console.error(`Error fetching data from ${endpoint}:`, error);
  }
};
// Hàm gửi dữ liệu lên API
export const postData = async (endpoint, data, toast) => {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    response
      .json()
      .then((data) => {
        if (toast) showToast("Thêm mới thành công");
        return data;
      })
      .catch((err) => {
        if (toast) showToast("Thêm không thành công");
      });
  } catch (error) {
    if (toast) showToast("Thêm không thành công");
    return console.error(`Error posting data to ${endpoint}:`, error);
  }
};

export const removeData = async (endpoint, id, toast) => {
  console.log(id);
  try {
    const response = await fetch(`${baseUrl}/${endpoint}/${id}`, {
      method: "DELETE",
    });
    response
      .json()
      .then((data) => {
        if (toast) showToast("Xóa thành công");
        fn();
      })
      .catch((err) => {
        if (toast) showToast("Xóa không thành công");
      });
  } catch (error) {
    if (toast) showToast("Xóa không thành công");
    return console.error(`Error deleting data from ${endpoint}:`, error);
  }
};

export const updateData = async (endpoint, id, data) => {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return console.error(`Error updating data in ${endpoint}:`, error);
  }
};

export const queryData = async (endpoint, query, toast) => {
  try {
    const queryString = Object.keys(query)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
      )
      .join("&");
    const fullUrl = `${baseUrl}/${endpoint}?${queryString}`;
    console.log(fullUrl);
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
    // Handle the data from the server
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, if any
  }
};

export const performSearch = async (endpoint, search) => {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`);
    const data = await response.json();
    const result_1 = data.filter((item) => fuzzySearch(item, search));
    console.log(result_1);
    return result_1;
  } catch (error) {
    return console.error("Error during search:", error);
  }
};

function fuzzySearch(item, term) {
  // Custom fuzzy search logic
  const newItem = { name: item.name, id: item.id };
  for (const key in newItem) {
    if (newItem[key].toString().toLowerCase().includes(term.toLowerCase())) {
      return true;
    }
  }
  return false;
}
