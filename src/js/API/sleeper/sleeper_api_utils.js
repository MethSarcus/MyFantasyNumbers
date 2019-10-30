function makeRequest(url) {
    var request = new XMLHttpRequest();
    request.responseType = "json";
    return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status >= 200 && request.status < 300) {
                resolve(request);
            }
            else {
                reject({
                    status: request.status,
                    statusText: request.statusText,
                });
            }
        };
        request.open("GET", url, true);
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
//# sourceMappingURL=sleeper_api_utils.js.map