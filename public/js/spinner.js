document.getElementById('searchBox').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const listings = document.querySelectorAll('#listingsContainer .card');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const spinner = document.getElementById('spinner');

    spinner.classList.remove('hidden'); // Show spinner

    setTimeout(() => {
        let hasVisibleListings = false;
        listings.forEach(function(listing) {
            const title = listing.getAttribute('data-title');

            if (title.includes(query)) {
                listing.classList.remove('hidden');
                hasVisibleListings = true;
            } else {
                listing.classList.add('hidden');
            }
        });

        if (!hasVisibleListings) {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
        }

        spinner.classList.add('hidden'); // Hide spinner after filtering
    }, 500); // Simulate loading time with a timeout
});