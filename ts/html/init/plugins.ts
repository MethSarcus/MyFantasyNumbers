declare var ScrollHint: any;
function enablePlugins(): void {
    $(() => {
        $('[data-toggle="tooltip"]').tooltip();
    });
    new ScrollHint("#league_trades_container", {
        suggestiveShadow: true
      });
}
