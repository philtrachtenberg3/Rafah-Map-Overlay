// Fetch the Google Maps API key from the backend
fetch('/api/key') 
    .then(response => response.json())
    .then(data => {
        initMap(data.apiKey); // Pass the API key to the map initialization
    });

function initMap(apiKey) {
    // If google is still undefined, create a retry in 100ms
    if (typeof google === 'undefined') {
        setTimeout(function(){ initMap(apiKey); }, 100);
        return;
    }

    // const myTown = { lat: YOUR_TOWN_LATITUDE, lng: YOUR_TOWN_LONGITUDE };
    const myTown = { lat: 43.0731, lng: -89.4012 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: myTown
    });

    // Static Image Overlay - Variables
    const overlayBounds = {
        north: 31.287626,
        south: 31.189233,
        east: 34.259600,
        west: 34.200295
    };
    let staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=Rafah,Palestine&zoom=12&size=400x400&key=${apiKey} 
                        &markers=color:red%7Clabel:R%7CRafah,Palestine`;
    let overlay = new google.maps.GroundOverlay(staticMapUrl, overlayBounds);
    overlay.setMap(map);

    // UI Elements and Event Listener
    const searchInput = document.getElementById('location-search');
    const updateButton = document.getElementById('update-overlay');
    updateButton.addEventListener('click', () => {
        updateOverlay(searchInput.value); 
    });

    // Overlay Update Logic
    function updateOverlay(location) {
        const geocoder = new google.maps.Geocoder(); 

        geocoder.geocode({ address: location }, (results, status) => {
            if (status === 'OK') {
                const newCenter = results[0].geometry.location; 

                // Update the static map URL 
                staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${newCenter.lat},${newCenter.lng}&zoom=12&size=400x400&key=${apiKey} 
                                &markers=color:red%7Clabel:R%7C${newCenter.lat},${newCenter.lng}`;

                // Remove existing overlay
                if (overlay) { 
                    overlay.setMap(null); 
                }

                // Create a new overlay
                overlay = new google.maps.GroundOverlay(staticMapUrl, overlayBounds);
                overlay.setMap(map); 
            } else {
                console.error('Geocode failed due to:', status);
                alert('Geocoding failed. Please check your search term and try again.'); 
            }
        });
    }

    setupMap(); // Call the function to load Google Maps 
}
