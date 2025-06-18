let isLoaded = false;

// ✅ HARDCODE your API key here temporarily
const GOOGLE_MAPS_API_KEY = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";

export function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isLoaded || window.google) return resolve();

    const existingScript = document.getElementById("googleMaps");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.id = "googleMaps";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isLoaded = true;
      resolve();
    };
    script.onerror = (e) => reject(e);

    document.head.appendChild(script);
  });
}
