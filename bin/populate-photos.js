/**
 * @fileoverview Module to fetch photos from Unsplash and add markers to a Leaflet map.
 */

export async function populatePhotos(map) {
	if (!map) {
		console.warn('populatePhotos: No map instance provided 🚀⚠️');
		return;
	}
	// Replace with your Unsplash API access key
	const accessKey = 'YOUR_ACCESS_KEY';
	const photosUrl = `https://api.unsplash.com/photos?client_id=${accessKey}`;

	try {
		const response = await fetch(photosUrl);
		if (!response.ok) {
			console.error('populatePhotos: Failed to fetch photos', response.status);
			return;
		}
		const photos = await response.json();
		photos.forEach((photo) => {
			// Ensure photo has location data
			if (
				photo.location &&
				photo.location.position &&
				photo.location.position.latitude &&
				photo.location.position.longitude
			) {
				const { latitude, longitude } = photo.location.position;
				const marker = L.marker([latitude, longitude]);
				marker.bindPopup(`
					<strong>${photo.user.name}</strong><br/>
					<img src="${photo.urls.thumb}" alt="${photo.alt_description || 'Photo'}" style="width:100px;"/>
				`);
				marker.addTo(map);
			}
		});
		console.log('populatePhotos: Successfully added photo markers to map 🚀📸');
	} catch (err) {
		console.error('populatePhotos: Error fetching photos', err);
	}
}
