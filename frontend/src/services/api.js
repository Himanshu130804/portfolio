// Central API helper.
//
// Production:
// Set VITE_API_URL to your deployed backend API URL.
//
// Local development:
// Falls back to http://localhost:5000/api

export const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| Generic API request
|--------------------------------------------------------------------------
|
| Important:
| JSON requests automatically receive application/json.
|
| FormData requests DO NOT manually receive Content-Type.
| The browser must generate the multipart boundary automatically.
|
*/

async function request(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  // Only use JSON Content-Type when
  // the request body is NOT FormData.
  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  try {
    const response = await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Parse response safely
    |--------------------------------------------------------------------------
    */

    const contentType =
      response.headers.get(
        "content-type"
      );

    let data = {};

    if (
      contentType &&
      contentType.includes(
        "application/json"
      )
    ) {
      data = await response.json();
    } else {
      const text =
        await response.text();

      data = {
        message:
          text ||
          "Unexpected server response.",
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Handle backend errors
    |--------------------------------------------------------------------------
    */

    if (!response.ok) {
      throw new Error(
        data.message ||
        `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | Network errors
    |--------------------------------------------------------------------------
    */

    if (
      error instanceof TypeError
    ) {
      throw new Error(
        "Cannot connect to the backend server. Make sure the backend is running."
      );
    }

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| API methods
|--------------------------------------------------------------------------
*/

export const api = {
  /*
  |--------------------------------------------------------------------------
  | Portfolio
  |--------------------------------------------------------------------------
  */

  getPortfolio: () =>
    request("/portfolio"),

  savePortfolio: (
    payload,
    token
  ) =>
    request("/portfolio", {
      method: "PUT",

      body:
        JSON.stringify(
          payload
        ),

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }),

  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  login: (payload) =>
    request("/auth/login", {
      method: "POST",

      body:
        JSON.stringify(
          payload
        ),
    }),

  /*
  |--------------------------------------------------------------------------
  | File upload
  |--------------------------------------------------------------------------
  |
  | This sends the ACTUAL FILE using multipart/form-data.
  |
  | DO NOT manually set Content-Type here.
  |
  */

  upload: (
    file,
    token
  ) => {
    if (!file) {
      return Promise.reject(
        new Error(
          "Please select a file."
        )
      );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    return request(
      "/upload",
      {
        method: "POST",

        body: formData,

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Messages
  |--------------------------------------------------------------------------
  */

  sendMessage: (
    payload
  ) =>
    request("/messages", {
      method: "POST",

      body:
        JSON.stringify(
          payload
        ),
    }),

  getMessages: (
    token
  ) =>
    request("/messages", {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }),

  deleteMessage: (
    id,
    token
  ) =>
    request(
      `/messages/${id}`,
      {
        method:
          "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    ),
};

/*
|--------------------------------------------------------------------------
| Asset URL helper
|--------------------------------------------------------------------------
|
| Backend uploads return:
|
| /uploads/filename.jpg
|
| But the frontend runs on:
| http://localhost:5173
|
| and the backend runs on:
| http://localhost:5000
|
| This converts the relative backend path into a complete URL.
|
*/

export function assetUrl(
  url
) {
  if (!url) {
    return "";
  }

  // Cloudinary / external URLs
  if (
    url.startsWith(
      "http://"
    ) ||
    url.startsWith(
      "https://"
    )
  ) {
    return url;
  }

  // Files bundled directly
  // with the frontend.
  if (
    url.startsWith(
      "/Himanshu_"
    )
  ) {
    return url;
  }

  /*
   * Remove "/api" from:
   *
   * http://localhost:5000/api
   *
   * giving:
   *
   * http://localhost:5000
   */

  const backendUrl =
    API_URL.replace(
      /\/api\/?$/,
      ""
    );

  return `${backendUrl}${url}`;
}