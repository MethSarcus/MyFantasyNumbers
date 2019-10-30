function espn_request(t, d) {
    return $.ajax({
        type: t,
        url: "js/proxy/espn_proxy.php",
        dataType: "json",
        data: d,
        cache: false,
        async: true,
    });
}
//# sourceMappingURL=espn_api_utils.js.map