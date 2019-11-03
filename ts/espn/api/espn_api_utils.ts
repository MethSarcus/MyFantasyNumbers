function espn_request(t: string, d: object) {
    return $.ajax({
        type: t,
        url: "./proxies/espn_proxy.php",
        dataType: "json",
        data: d,
        cache: false,
        async: true,
    });
}
