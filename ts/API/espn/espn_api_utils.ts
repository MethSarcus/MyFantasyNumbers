function espn_request(t: string, d: object) {
    return $.ajax({
        type: t,
        url: "js/proxy/espn_proxy.php",
        dataType: "json",
        data: d,
        cache: false,
        async: true,
    });
}
