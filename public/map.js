function initMap(apiKey) {
    // If google is still undefined, create a retry in 100ms
    if (typeof google === 'undefined') {
        setTimeout(function() { initMap(apiKey); }, 100);
        return;
    }

    // Initialize the map without a set center. The center will be set upon user input.
    const mapOptions = {
        zoom: 12 // Default zoom
    };
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    let overlay; // Define overlay here but don't initialize yet

    // UI Elements and Event Listener
    const searchInput = document.getElementById('location-search');
    const updateButton = document.getElementById('update-overlay');

    // Event listener for the update button
    updateButton.addEventListener('click', () => {
        // Call updateOverlay when the button is clicked, passing the necessary arguments
        updateOverlay(searchInput.value, map, apiKey, overlay); 
    });
}

// Move the updateOverlay function outside of initMap to avoid redefining it every time initMap is called
function updateOverlay(location, map, apiKey, overlay) {
    const geocoder = new google.maps.Geocoder(); 

    geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK') {
            const newCenter = results[0].geometry.location; 
            const viewport = results[0].geometry.viewport; // Get the viewport for the geocoded location

            // Define new bounds based on the viewport
            const overlayBounds = {
                north: viewport.getNorthEast().lat(),
                south: viewport.getSouthWest().lat(),
                east: viewport.getNorthEast().lng(),
                west: viewport.getSouthWest().lng()
            };

            // Update the static map URL dynamically based on geocoding results
            let staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${newCenter.lat()},${newCenter.lng()}&zoom=12&size=400x400&key=${apiKey}&markers=color:red%7Clabel:R%7C${newCenter.lat()},${newCenter.lng()}`;

            // Remove existing overlay if it exists
            if (overlay) { 
                overlay.setMap(null); 
            }

            // Create a new overlay with the updated URL and bounds
            overlay = new google.maps.GroundOverlay(staticMapUrl, overlayBounds);
            overlay.setMap(map); 

            // Adjust the map view to fit the new location's viewport
            map.fitBounds(viewport);
        } else {
            console.error('Geocode failed due to:', status);
            alert('Geocoding failed. Please check your search term and try again.'); 
        }
    });
}
