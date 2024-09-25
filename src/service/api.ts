const SECRET_KEY =
  "PeZJRxlkttOI7z75NndRdn182gHhCVy9ZmM2h0m6nmwK9CZibz0bnZN6jbbwnXU3";
const SECRET_ID = "62aac187-cd48-4e41-a281-71d75ae40812";
const REDIRECT_URL = "http://localhost:5173/";
const DOMAIN = "ibrahimorunbaev59";

export const redirectToAuthPage = () => {
  try {
    const url = `https://www.amocrm.ru/oauth?client_id=${SECRET_ID}&redirect_uri=${REDIRECT_URL}&response_type=code`;
    window.location.href = url;
  } catch (e) {
    console.error(e);
  }
};

export const  fetchAccessToken  = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");
  console.log(authCode);

  if (!authCode) {
    console.error("Authorization code not found in the URL");
    return;
  }

  try {
    const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
    const response = await fetch(
      `${proxyUrl}https://${DOMAIN}.amocrm.ru/oauth2/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: SECRET_ID,
          client_secret: SECRET_KEY,
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: REDIRECT_URL,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server Error:", response.status, errorData);
      return;
    }

    const data = await response.json();
    console.log("Access Token Response:", data);
    if (data.access_token) {
      localStorage.setItem("response", JSON.stringify(data));
    }
  } catch (e) {
    console.error("Error fetching token:", e);
  }
};
