// API base for frontend → backend calls (kept CRA tooling, backend on 5000)
// export const server = "http://localhost:8000/api/v2";

//  export const backend_url = "http://localhost:8000/";
export const server = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
