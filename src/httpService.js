export default async function postData(apiUrl, data) {
  const response = await fetch(apiUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response;
}
