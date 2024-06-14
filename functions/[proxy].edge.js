const blueDeploymentHost = "edge-blue-green-legacy.contentstackapps.com";
const greenDeploymentHost = "edge-blue-green.contentstackapps.com";

export default async function handler(request) {
  const randomNumber = Math.floor((Math.random() * 10) + 1);
  const modifiedUrl = new URL(request.url);
  if (randomNumber % 2 === 0) {
    modifiedUrl.hostname = blueDeploymentHost;
  } else {
    modifiedUrl.hostname = greenDeploymentHost;
  }

  const newRequest = new Request(modifiedUrl, request);
  return fetch(newRequest);
}
