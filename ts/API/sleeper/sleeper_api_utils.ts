function makeRequest(url: string): Promise<XMLHttpRequest> {
    // Create the XHR request
    const request = new XMLHttpRequest();
    request.responseType = "json";

    // Return it as a Promise
    return new Promise((resolve, reject) => {
        // Setup our listener to process compeleted requests
        request.onreadystatechange = () => {

            // Only run if the request is complete
            if (request.readyState !== 4) { return; }

            // Process the response
            if (request.status >= 200 && request.status < 300) {
                // If successful
                resolve(request);
            } else {
                // If failed
                reject({
                    status: request.status,
                    statusText: request.statusText,
                });
            }
        };

        // Setup our HTTP request
        request.open("GET", url, true);

        // Send the request
        request.send();

    });
}

function sleeper_request(t, d) {
    return $.ajax({
        type: t,
        url: "js/proxy/sleeper_proxy.php",
        dataType: "json",
        data: d,
        cache: false,
        async: true,
    });
}
