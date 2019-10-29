module.exports = __NEXT_REGISTER_PAGE("/football/recentactivity", function () {
    var e = webpackJsonp([222], {
        127: function (e, t, a) {
            "use strict";
            var r = a(14);
            var n = a.n(r);
            var o = a(10);
            var i = a.n(o);
            var s = a(7);
            var l = a(65);
            var c = a(207);
            var u = a(60);
            var d = function e(t) {
                var a = t.config,
                    r = t.onReaction,
                    n = void 0 === r ? o["noop"] : r,
                    i = t.seasonId,
                    l = t.url;
                return Object(s["reaction"])(function () {
                    return parseInt(l.query.seasonId, 10)
                }, function () {
                    n({
                        seasonId: Object(u["a"])({
                            config: a,
                            query: l.query
                        }, i)
                    })
                }, true)
            };
            var p = d;

            function f(e) {
                return function () {
                    var t = this,
                        a = arguments;
                    return new Promise(function (r, n) {
                        var o = e.apply(t, a);

                        function i(e, t) {
                            try {
                                var a = o[e](t);
                                var i = a.value
                            } catch (e) {
                                n(e);
                                return
                            }
                            a.done ? r(i) : Promise.resolve(i).then(s, l)
                        }

                        function s(e) {
                            i("next", e)
                        }

                        function l(e) {
                            i("throw", e)
                        }
                        s()
                    })
                }
            }
            var m = function e(t) {
                var a = t.config,
                    r = t.intl,
                    i = t.onReaction,
                    u = void 0 === i ? o["noop"] : i,
                    d = t.page,
                    m = t.seasonId,
                    g = t.url;
                return p({
                    config: a,
                    onReaction: function () {
                        var e = f(n.a.mark(function e(t) {
                            var o, i, p;
                            return n.a.wrap(function e(n) {
                                while (1) switch (n.prev = n.next) {
                                    case 0:
                                        o = t.seasonId;
                                        n.next = 3;
                                        return Object(c["a"])(a, o);
                                    case 3:
                                        i = n.sent;
                                        p = Object(l["h"])({
                                            seasonConfig: i
                                        }, r);
                                        Object(s["runInAction"])(function () {
                                            var e = d.get("config");
                                            var t = d.get("seasonConfig");
                                            e && i && e.constants.seasonConfig === i.constants.seasonConfig || d.merge({
                                                config: i
                                            });
                                            t && i && t.constants.seasonConfig === i.constants.seasonConfig || d.merge({
                                                seasonConfig: i
                                            });
                                            d.merge({
                                                errors: p
                                            })
                                        });
                                        u({
                                            seasonConfig: i,
                                            seasonId: o
                                        });
                                    case 7:
                                    case "end":
                                        return n.stop()
                                }
                            }, e, this)
                        }));
                        return function t(a) {
                            return e.apply(this, arguments)
                        }
                    }(),
                    seasonId: m,
                    url: g
                })
            };
            var g = t["a"] = m
        },
        128: function (e, t, a) {
            "use strict";
            var r = a(7);
            var n = a(34);
            var o = a.n(n);
            var i = a(141);
            var s = a.n(i);
            var l = a(32);
            t["a"] = function () {
                var e = Object(r["observable"])({
                    playersTransactionList: [],
                    status: null,
                    playersTransactionsByAction: Object(r["computed"])(function () {
                        var t = {};
                        e.playersTransactionList.forEach(function (e) {
                            t[e.action] || (t[e.action] = []);
                            e.action === l["g"] ? t[e.action].push(e.pick) : t[e.action].push(e.player)
                        });
                        return t
                    }),
                    addPlayer: Object(r["action"])(function (t, a, r) {
                        var n = [];
                        if (a === l["s"] && e.hasPlayerInAction(l["s"], t.id)) {
                            var i = o()(e.playersTransactionList, function (e) {
                                return e.player.id
                            });
                            var c = i[t.id].some(function (e) {
                                return e.player.lineupSlotId === r.id
                            });
                            c && (n = s()(e.playersTransactionList, function (e) {
                                var a = e.player;
                                return a.id === t.id
                            }))
                        }
                        if (a !== l["s"] || !n.length) {
                            var u = {
                                id: t.id,
                                name: t.fullName,
                                defaultPositionId: t.defaultPositionId,
                                teamId: t.onTeamId,
                                proTeamId: t.proTeamId,
                                lineupSlotId: t.lineupSlotId,
                                toSlotId: r && r.id
                            };
                            e.playersTransactionList.push({
                                action: a,
                                player: u
                            })
                        }
                    }),
                    addDraftPick: Object(r["action"])(function (t) {
                        e.playersTransactionList.push({
                            action: l["g"],
                            pick: t
                        })
                    }),
                    updatePlayer: Object(r["action"])(function (t, a, r, n) {
                        var o = {
                            id: t.id
                        };
                        o[n.showFutureKeepers ? "keeperValueFuture" : "keeperValue"] = r;
                        if (e.playersTransactionList.find(function (e) {
                                return e.player.id === t.id
                            })) {
                            if (e.playersTransactionList.find(function (e) {
                                    return e.player.id === t.id
                                }) && e.playersTransactionList.find(function (e) {
                                    return e.player.keeperValue !== r || e.player.keeperValueFuture !== r
                                })) {
                                e.removePlayer(t);
                                e.playersTransactionList.push({
                                    action: a,
                                    player: o
                                })
                            }
                        } else e.playersTransactionList.push({
                            action: a,
                            player: o
                        })
                    }),
                    movingGroupId: null,
                    movingPlayer: null,
                    movingSlot: null,
                    movingSlotIndex: null,
                    removePlayer: Object(r["action"])(function (t) {
                        e.playersTransactionList = e.playersTransactionList.filter(function (e) {
                            return e.pick || e.player.id !== t.id
                        })
                    }),
                    removeDraftPick: Object(r["action"])(function (t) {
                        e.playersTransactionList = e.playersTransactionList.filter(function (e) {
                            return e.player || e.pick.id !== t.id
                        })
                    }),
                    clearStore: Object(r["action"])(function () {
                        e.playersTransactionList = [];
                        e.status = null
                    })
                });
                e.hasPlayerInAction = function (t, a) {
                    var r = e.playersTransactionsByAction;
                    return !!r[t] && !!r[t].find(function (e) {
                        return e.id === a
                    })
                };
                return e
            }
        },
        138: function (e, t, a) {
            var r = Object.assign || function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var a = arguments[t];
                    for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r])
                }
                return e
            };
            var n = a(0),
                o = a(4),
                i = a(12);

            function s(e) {
                var t = i(e, ["children", "name"]);
                return n.createElement("div", t, c(e))
            }
            s.displayName = "RadioGroup";

            function l(e) {
                var t = e && e.className,
                    a = e && e.disabled,
                    s = e && e.id,
                    l = e && e.label,
                    c = i(e, ["label", "className"]),
                    u;
                u = o("control control--radio", t, {
                    "control--disabled": a
                });
                return n.createElement("label", {
                    htmlFor: s,
                    className: u
                }, l, n.createElement("input", r({
                    type: "radio",
                    className: o("form__control form__control--radio", t)
                }, c)), n.createElement("div", {
                    className: "control__indicator"
                }))
            }
            l.displayName = "RadioOption";

            function c(e) {
                var t = e && e.children,
                    a = e && (e.name || e.displayName || e.componentName) || "";
                return n.Children.map(t, function (e) {
                    var t = e && e.type,
                        r = t && t.displayName || "",
                        o = e || null;
                    "RadioOption" === r && n.isValidElement(e) && (o = n.cloneElement(e, {
                        name: a
                    }));
                    return o
                })
            }
            e.exports = {
                RadioGroup: s,
                RadioOption: l
            }
        },
        190: function (e, t, a) {
            "use strict";
            var r = a(23);
            var n = a.n(r);
            var o = a(7);
            var i = a(127);
            var s = function e(t) {
                var a = t.config,
                    r = t.guest,
                    s = t.intl,
                    l = t.onReaction,
                    c = t.page,
                    u = t.seasonId,
                    d = t.url;
                return [Object(i["a"])({
                    config: a,
                    intl: s,
                    page: c,
                    seasonId: u,
                    url: d
                }), Object(o["reaction"])(function () {
                    return {
                        leagueId: parseInt(d.query.leagueId, 10),
                        loggedIn: r && r.loggedIn,
                        seasonConfig: c.get("seasonConfig")
                    }
                }, function (e) {
                    var t = e.leagueId,
                        a = e.loggedIn,
                        r = e.seasonConfig;
                    r && null !== a && l({
                        leagueId: t,
                        seasonConfig: r,
                        seasonId: r.constants.seasonConfig
                    })
                }, {
                    fireImmediately: true,
                    equals: n.a
                })]
            };
            t["a"] = s
        },
        200: function (e, t, a) {
            e.exports = a(201)
        },
        201: function (e, t, a) {
            var r = a(0),
                n = a(4),
                o = a(1),
                i = a(286),
                s = a(159);

            function l(e, t) {
                t.preventDefault();
                e(t, parseInt(t.currentTarget.getAttribute("data-nav-item"), 10))
            }

            function c(e) {
                var t = n("PaginationNav inline-flex justify-center items-center", e.className),
                    a = e && e.activeNavItem,
                    o = Math.max(1, Math.min(7, e && e.navItemsShown)),
                    c = e && e.navItemsTotal || o,
                    u = c - 1,
                    d = 7 === o && o < c,
                    p = d ? Math.max(0, Math.min(a - Math.ceil(o / 2), u - o + 1)) : 0,
                    f = Math.min(u, p + o - 1),
                    m = [],
                    g, v, y, _, b, h = l.bind(null, e.onClickItem),
                    T = l.bind(null, e.onClickPrevButton || e.onClickItem),
                    w = l.bind(null, e.onClickNextButton || e.onClickItem),
                    M = a === c,
                    E = 1 === a;
                for (v = p; v <= f; v++) m.push(v + 1);
                if (d) {
                    if (1 !== m[0]) {
                        m[0] = 1;
                        m[1] = "..."
                    }
                    if (m[o - 1] !== c) {
                        m[o - 2] = "...";
                        m[o - 1] = c
                    }
                }
                return r.createElement("div", {
                    className: t,
                    id: e.id
                }, r.createElement(i, {
                    icon: "caret__left",
                    onClick: E ? null : T,
                    alt: true,
                    disabled: E,
                    "data-nav-item": a - 1
                }), r.createElement("div", {
                    className: "PaginationNav__wrap overflow-x-auto"
                }, r.createElement("ul", {
                    className: "PaginationNav__list nowrap"
                }, m.map(function (e, t) {
                    y = e;
                    _ = a === e;
                    b = isNaN(y);
                    g = n("PaginationNav__list__item inline-flex justify-center items-center clr-gray-06 ba b--solid b--100 pa0", {
                        "PaginationNav__list__item--active": _,
                        "PaginationNav__list__item--ellipsis": b,
                        "brdr-clr-negative": _,
                        "brdr-clr-white": !_,
                        "clr-link": _
                    });
                    b || _ || (y = r.createElement(s, {
                        "data-nav-item": e,
                        to: "#",
                        isRouterLink: false,
                        externalLink: true,
                        id: e,
                        onClick: h,
                        classes: "PaginationNav__list__item__link flex justify-center items-center"
                    }, y));
                    return r.createElement("li", {
                        className: g,
                        key: t
                    }, y)
                }))), r.createElement(i, {
                    icon: "caret__right",
                    onClick: M ? null : w,
                    alt: true,
                    className: "inline-flex",
                    disabled: M,
                    "data-nav-item": a + 1
                }))
            }
            c.propTypes = {
                id: o.string,
                activeNavItem: o.number.isRequired,
                navItemsShown: o.number.isRequired,
                navItemsTotal: o.number,
                onClickItem: o.func.isRequired,
                onClickPrevButton: o.func,
                onClickNextButton: o.func
            };
            c.defaultProps = {
                activeNavItem: 1,
                navItemsShown: 7,
                navItemsTotal: 1
            };
            e.exports = c
        },
        224: function (e, t, a) {
            "use strict";
            var r = a(42);
            var n = a(53);
            var o = a(92);
            var i = a.n(o);
            var s = a(88);
            var l = a.n(s);
            var c = a(58);
            t["a"] = function (e, t, a) {
                var o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
                var s = e.uri_nextgen_ui;
                var u = t.currentMatchupPeriod,
                    d = t.id,
                    p = t.isArchiveMode,
                    f = t.seasonId;
                var m = a.away,
                    g = a.home,
                    v = a.matchupPeriodId;
                var y = (new Date).valueOf();
                var _ = Object(n["a"])(t, v);
                var b;
                var h = null;
                var T = o.view,
                    w = o.page,
                    M = void 0 === w ? "boxscore" : w;
                var E = m ? m.teamId : g.teamId;
                if (p) return null;
                if (v === u)
                    for (var O = 0, I = _.length; O < I; O++) {
                        var S = _[O];
                        var j = S.startDate;
                        if (b && !(j < y)) break;
                        b = S
                    } else b = v < u ? l()(_) : i()(_);
                if (b) {
                    var x = b,
                        C = x.endDate,
                        P = x.id;
                    h = P;
                    C > y && (T = T || r["e"])
                }
                T = e.isWeeklyGame ? r["e"] : T || r["a"];
                return Object(c["a"])({
                    pathname: "/".concat(s, "/").concat(M),
                    query: {
                        leagueId: d,
                        matchupPeriodId: v,
                        scoringPeriodId: h,
                        seasonId: f,
                        teamId: E,
                        view: T
                    }
                })
            }
        },
        2509: function (e, t, a) {
            e.exports = a(2510)
        },
        2510: function (e, t, a) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            var r = a(820);
            var n = a(46);
            var o = a(294);
            t["default"] = Object(n["b"])(r["default"], {
                config: o["c"]
            })
        },
        304: function (e, t, a) {
            "use strict";
            var r = a(98);
            var n = a.n(r);
            var o = a(47);
            var i = a.n(o);
            var s, l;

            function c(e, t) {
                return p(e) || d(e, t) || u()
            }

            function u() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }

            function d(e, t) {
                var a = [];
                var r = true;
                var n = false;
                var o = void 0;
                try {
                    for (var i = e[Symbol.iterator](), s; !(r = (s = i.next()).done); r = true) {
                        a.push(s.value);
                        if (t && a.length === t) break
                    }
                } catch (e) {
                    n = true;
                    o = e
                } finally {
                    try {
                        r || null == i["return"] || i["return"]()
                    } finally {
                        if (n) throw o
                    }
                }
                return a
            }

            function p(e) {
                if (Array.isArray(e)) return e
            }

            function f(e, t, a) {
                t in e ? Object.defineProperty(e, t, {
                    value: a,
                    enumerable: true,
                    configurable: true,
                    writable: true
                }) : e[t] = a;
                return e
            }
            var m = "b";
            var g = "i";
            var v = "u";
            var y = "link";
            var _ = "center";
            var b = "image";
            var h = "quote";
            var T = "yt";
            var w = "player";
            var M = "#LEAGUEID#";
            var E = "#TEAMID#";
            var O = [m, g, v, y, _, b, h, T, w];
            var I = i()(O, function (e, t) {
                e[t] = "player" === t ? /(\[player#([0-9]+)\])(.*?)(\[\/player\])/g : new RegExp("\\[(".concat(t, ")\\](.*?)\\[/(").concat(t, ")\\]"), "g")
            }, {});
            var S = [
                [/\n<br>/g, ""],
                [/</g, "&lt;"],
                [/>/g, "&gt;"],
                [/"/g, "&quot;"],
                [/\n/g, "<br>"]
            ];
            var j = (s = {}, f(s, m, "</b>"), f(s, g, "</i>"), f(s, v, "</u>"), f(s, y, "</a>"), f(s, _, "</div>"), f(s, b, ""), f(s, h, "</div></div>"), f(s, T, ""), f(s, w, "</a>"), s);
            var x = (l = {}, f(l, m, "<b>"), f(l, g, "<i>"), f(l, v, "<u>"), f(l, y, '<a href="###" target="_blank">'), f(l, _, '<div style="width:100%;text-align:center;">'), f(l, b, '<img src="###" border=0><br />'), f(l, h, '<div align=center style="width:100%;padding:15px;"><div style="width:80%;font-style:italic;padding-left:25px;color:#666;text-align:justify;text-justify:distribute;background: url(https://a.espncdn.com/i/boards/04b/quote.gif) no-repeat 0 2px;">'), f(l, T, '<object width="420" height="355"><param name="movie" value="https://www.youtube.com/v/###&hl=en&rel=0"></param><param name="wmode" value="transparent"></param><embed src="https://www.youtube.com/v/###&hl=en&rel=0" type="application/x-shockwave-flash" wmode="transparent" width="420" height="355"></embed></object>'), f(l, w, '<a href="" class="flexpop" content="tabs#ppc" instance="_ppc" fpopHeight="357px" fpopWidth="490px" tab="0" leagueId="'.concat(M, '" playerId="###" teamId="').concat(E, '" cache="true">')), l);
            var C = "?v=";
            t["a"] = function (e) {
                var t = null;
                if (null !== e) {
                    t = n()(S, function (e, t) {
                        return e.replace(t[0], t[1])
                    }, e);
                    O.forEach(function (e) {
                        var a = I[e];
                        var r = t.match(a);
                        r && r.forEach(function (r) {
                            var n = new RegExp(a.source, "g").exec(r);
                            var o = c(n, 4),
                                i = o[2],
                                s = o[3];
                            var l = x[e];
                            var u = j[e];
                            var d;
                            switch (e) {
                                case b:
                                    d = i;
                                    i = "";
                                    break;
                                case y:
                                    d = i;
                                    break;
                                case w:
                                    l = "";
                                    u = "";
                                    i = s;
                                    break;
                                case T:
                                    if (i.indexOf("youtube.com") > 1) {
                                        var p = i.indexOf(C);
                                        if (p > 0) {
                                            var f = i.indexOf("&");
                                            var m = i.indexOf("#");
                                            d = f > 0 && m > 0 ? i.substring(p + C.length, Math.min(f, m)) : f < 0 && m < 0 ? i.substring(p + C.length) : i.substring(p + C.length, Math.max(f, m))
                                        }
                                    }
                                    i = "";
                                    break
                            }
                            d && (l = l.replace("###", d));
                            t = t.replace(r, [l, i, u].join(""))
                        })
                    })
                }
                return t
            }
        },
        306: function (e, t, a) {
            "use strict";
            var r = a(0);
            var n = a.n(r);
            var o = a(3);
            var i = a(15);
            var s = a.n(i);
            var l = a(2);
            var c = a(7);
            var u = a(6);
            var d = a.n(u);
            var p = a(32);
            var f = a(18);
            var m = a.n(f);
            var g = a(326);
            var v = a(9);
            var y = a.n(v);
            var _ = a(16);
            var b = a.n(_);
            var h = a(359);
            var T = a(5);
            var w = a.n(T);
            var M = a(1);
            var E = a.n(M);
            var O = a(44);
            var I = a(133);
            var S = a(344);

            function j(e) {
                j = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return j(e)
            }

            function x(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function C(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function P(e, t, a) {
                t && C(e.prototype, t);
                a && C(e, a);
                return e
            }

            function D(e, t) {
                if (t && ("object" === j(t) || "function" === typeof t)) return t;
                return A(e)
            }

            function k(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function A(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            var N = Object(l["h"])({
                continueLeagueOffice: {
                    id: "lm_poll_modal_continue_league_office",
                    defaultMessage: "Continue to League Office"
                },
                returnToRecentActivity: {
                    id: "lm_poll_modal_return_to_recent_activity",
                    defaultMessage: " Return to Recent Activity"
                }
            });
            var L = function (e) {
                k(t, e);

                function t(e) {
                    var a;
                    x(this, t);
                    a = D(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    a.onClick_CloseLightbox = a.onClick_CloseLightbox.bind(A(a));
                    return a
                }
                P(t, [{
                    key: "onClick_CloseLightbox",
                    value: function e() {
                        var t = this;
                        Object(c["runInAction"])(function () {
                            t.props.store.showViewPoll = false
                        })
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.config,
                            r = t.config.uri_nextgen_ui,
                            o = t.guest,
                            i = t.intl,
                            s = t.store,
                            l = t.league,
                            c = t.topic,
                            u = t.url,
                            d = t.getUpdatedTopics;
                        var p = l.id,
                            f = l.seasonId;
                        var m = "/".concat(r, "/league?leagueId=").concat(p, "&seasonId=").concat(f);
                        return n.a.createElement("div", {
                            className: "jsx-1989360267 lm-poll-modal"
                        }, n.a.createElement(w.a, {
                            styleId: "1989360267",
                            css: [".lm-poll-modal.jsx-1989360267{color:#269D00;font-size:24px;}", ".lm-poll-modal.jsx-1989360267{color:#666768;font-size:12px;}", ".lm-poll-modal.jsx-1989360267 .lightbox__contentBox{width:320px;height:auto;}", ".continue-to-league-office:after{width:0 !important;}", ".lm-poll-modal.jsx-1989360267 .lm-poll-content .lm-poll-question{line-height:23px;}"]
                        }), n.a.createElement(I["a"], {
                            noHeader: true,
                            isContent: true,
                            toggleState: this.onClick_CloseLightbox,
                            isActive: s.showViewPoll,
                            showCloseButton: true
                        }, n.a.createElement(S["a"], {
                            config: a,
                            guest: o,
                            intl: i,
                            league: l,
                            topic: c,
                            url: u,
                            getUpdatedTopics: d
                        }), n.a.createElement("div", {
                            className: "jsx-1989360267 tc flex flex-column"
                        }, n.a.createElement(O["a"], {
                            className: "continue-to-league-office mb3 w-100",
                            href: m
                        }, i.formatMessage(N.continueLeagueOffice)), n.a.createElement(O["b"], {
                            className: "w-100",
                            onClick: this.onClick_CloseLightbox
                        }, i.formatMessage(N.returnToRecentActivity)))))
                    }
                }]);
                return t
            }(n.a.Component);
            var R = Object(o["observer"])(L);
            var V = a(48);
            var F = a(224);
            a.d(t, "b", function () {
                return Q
            });

            function Y(e) {
                Y = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return Y(e)
            }

            function B(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function U(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function q(e, t, a) {
                t && U(e.prototype, t);
                a && U(e, a);
                return e
            }

            function H(e, t) {
                if (t && ("object" === Y(t) || "function" === typeof t)) return t;
                return W(e)
            }

            function z(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function W(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            var G = Object(l["h"])({
                rosterLink: {
                    id: "recent_activity_actionCell_roster",
                    defaultMessage: "{abbrev} Roster"
                },
                reportLink_waivers: {
                    id: "recent_activity_actionCell_report_waivers",
                    defaultMessage: "Waiver Report"
                },
                reportLink_faab: {
                    id: "recent_activity_actionCell_report_faab",
                    defaultMessage: "Auction Report"
                },
                lmLink: {
                    id: "recent_activity_actionCell_lm",
                    defaultMessage: "View"
                },
                messageLink: {
                    id: "recent_activity_actionCell_message",
                    defaultMessage: "View/Reply"
                },
                draftRecapLink: {
                    id: "recent_activity_actionCell_draftRecap",
                    defaultMessage: "Draft Recap"
                },
                reviewTrade: {
                    id: "recent_activity_actionCell_review_trade",
                    defaultMessage: "Review"
                },
                voteTrade: {
                    id: "recent_activity_actionCell_vote_trade",
                    defaultMessage: "Vote"
                },
                leagueSettings: {
                    id: "recent_activity_type_status_leagueSettings",
                    defaultMessage: "League Settings"
                },
                leagueMembers: {
                    id: "recent_activity_type_status_leagueMembers",
                    defaultMessage: "League Members"
                },
                viewPoll: {
                    id: "recent_activity_actionCell_viewPoll",
                    defaultMessage: "View Poll"
                },
                viewBoxScore: {
                    id: "view_box_score",
                    defaultMessage: "View Box Score"
                }
            });
            var J = 165;
            var X = function e(t, a) {
                return !!a.pendingTransactionsMap[t]
            };
            var K = function e(t, a) {
                var r = [t.transactionWaiverAdd, t.transactionWaiverDrop];
                var n = a.filter(function (e) {
                    return b()(r, e.messageTypeId)
                });
                return n.length > 0
            };
            var $ = function e(t, a) {
                var r = a.filter(function (e) {
                    return b()(Object(h["a"])(t), e.messageTypeId)
                });
                return r.length > 0
            };
            var Q = function e(t, a) {
                var r = a.filter(function (e) {
                    return e.messageTypeId === t.transactionLMMatchupAdjustmentChange
                });
                return r.length > 0
            };
            var Z = function (e) {
                z(t, e);

                function t(e) {
                    var a;
                    B(this, t);
                    a = H(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    a.store = Object(c["observable"])({
                        showViewPoll: false
                    });
                    a.viewPoll = a.viewPoll.bind(W(a));
                    return a
                }
                q(t, [{
                    key: "viewPoll",
                    value: function e() {
                        var t = this;
                        Object(c["runInAction"])(function () {
                            t.store.showViewPoll = true
                        })
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.config,
                            r = t.guest,
                            o = t.league,
                            i = t.intl,
                            c = t.message,
                            u = t.type,
                            f = t.config.constants.communication.communicationTypes,
                            v = t.url,
                            _ = t.getUpdatedTopics;
                        var b = c.id,
                            h = c.date,
                            T = c.targetId,
                            w = c.messages;
                        var M = o.id,
                            E = o.seasonId,
                            O = o.usesFAAB;
                        var I = null;
                        if ("NOTE" === u) I = n.a.createElement(m.a, {
                            to: "/".concat(a.uri_nextgen_ui, "/league?leagueId=").concat(M, "&seasonId=").concat(E)
                        }, n.a.createElement(l["b"], G.lmLink));
                        else if ("ACTIVITY_TRANSACTIONS" === u) {
                            var S = o.teamsMap;
                            var j = f.transactionRoster,
                                x = f.transactionRosterDrop;
                            var C = d()(c, "messages[0]");
                            var P;
                            var D = "";
                            var k = [];
                            var A = 0;
                            if (C) {
                                w.some(function (e, t) {
                                    if (e.to && e.from) {
                                        A = t;
                                        return true
                                    }
                                    return false
                                });
                                P = [j, x].includes(c.messages[A].messageTypeId) ? c.messages[A].for : c.messages[A].to;
                                P && P > 0 && S[P] && (D = S[P].abbrev)
                            }
                            P && k.push(n.a.createElement(m.a, {
                                to: "/".concat(a.uri_nextgen_ui, "/team?leagueId=").concat(M, "&seasonId=").concat(E, "&teamId=").concat(P)
                            }, i.formatMessage(G.rosterLink, {
                                abbrev: D
                            })));
                            if (K(f, w)) k.push(n.a.createElement(m.a, {
                                to: "/".concat(a.uri_nextgen_ui, "/league/").concat(O ? "auctionreport" : "waiverreport", "?leagueId=").concat(M, "&seasonId=").concat(E, "&waiverDate=").concat(s.a.utc(h).format(g["a"]))
                            }, n.a.createElement(l["b"], O ? G.reportLink_faab : G.reportLink_waivers)));
                            else if ($(f, w)) {
                                var N = c.messages[A].from;
                                var L = c.messages[A].to;
                                if (N && S[N]) {
                                    var Y = S[N].abbrev;
                                    k.push(n.a.createElement(m.a, {
                                        to: "/".concat(a.uri_nextgen_ui, "/team?leagueId=").concat(M, "&seasonId=").concat(E, "&teamId=").concat(N)
                                    }, i.formatMessage(G.rosterLink, {
                                        abbrev: Y
                                    })))
                                }
                                if (X(T, o)) {
                                    o.hasLeagueManagerPowers(r) && k.push(n.a.createElement(m.a, {
                                        to: "/".concat(a.uri_nextgen_ui, "/tradereview?leagueId=").concat(o.id, "&transactionId=").concat(T, "&mode=").concat(p["q"]),
                                        className: "action-link"
                                    }, i.formatMessage(G.reviewTrade)));
                                    var B = Object(V["a"])({
                                        config: a,
                                        guest: r,
                                        league: o,
                                        query: v.query
                                    });
                                    var U = N !== B && L !== B;
                                    U && k.push(n.a.createElement(m.a, {
                                        to: "/".concat(a.uri_nextgen_ui, "/tradereview?leagueId=").concat(o.id, "&transactionId=").concat(T, "&mode=").concat(p["I"]),
                                        className: "action-link  vote-trade"
                                    }, i.formatMessage(G.voteTrade)))
                                }
                            }
                            I = k
                        } else if ("MSG_BOARD" === u) I = n.a.createElement(m.a, {
                            to: "/".concat(a.uri_nextgen_ui, "/messageboard?leagueId=").concat(M, "&seasonId=").concat(E, "&topicId=").concat(b)
                        }, n.a.createElement(l["b"], G.messageLink));
                        else if ("ACTIVITY_SETTINGS" === u) I = y()(c.messages, ["messageTypeId", J]) ? n.a.createElement(m.a, {
                            to: "/".concat(a.uri_nextgen_ui, "/tools/leaguemembers?leagueId=").concat(M)
                        }, n.a.createElement(l["b"], G.leagueMembers)) : n.a.createElement(m.a, {
                            to: "/".concat(a.uri_nextgen_ui, "/league/settings?leagueId=").concat(M, "&seasonId=").concat(E)
                        }, n.a.createElement(l["b"], G.lmLink));
                        else if ("ACTIVITY_STATUS" === u) {
                            var q = y()(c.messages, {
                                messageTypeId: f.draftStatusDraftComplete
                            });
                            q && (I = n.a.createElement(m.a, {
                                to: "/".concat(a.uri_nextgen_ui, "/league/settings?leagueId=").concat(M)
                            }, n.a.createElement(l["b"], G.leagueSettings)))
                        } else if ("POLL" === u) I = c.isDeleted ? "" : n.a.createElement(m.a, {
                            onClick: this.viewPoll
                        }, n.a.createElement(l["b"], G.viewPoll));
                        else if ("ACTIVITY_SCHEDULE" === u) {
                            var H = this.props,
                                z = H.config,
                                W = H.league,
                                Z = H.message.messages;
                            var ee = z.constants.communication.communicationTypes,
                                te = ee.modifiedSchedule,
                                ae = ee.resetSchedule,
                                re = ee.transactionLMMatchupAdjustmentChange;
                            var ne = Q(f, Z);
                            for (var oe = 0, ie = Z.length; oe < ie; oe++) {
                                var se = Z[oe],
                                    le = se.messageTypeId,
                                    ce = se.subject;
                                if (ne) {
                                    if (le === re) {
                                        I = n.a.createElement(m.a, {
                                            to: Object(F["a"])(z, W, y()(W.schedule, {
                                                id: +ce
                                            }))
                                        }, n.a.createElement(l["b"], G.viewBoxScore));
                                        break
                                    }
                                } else if (le === te || le === ae) {
                                    I = n.a.createElement(m.a, {
                                        to: "/".concat(z.uri_nextgen_ui, "/league/settings?leagueId=").concat(M)
                                    }, n.a.createElement(l["b"], G.leagueSettings));
                                    break
                                }
                            }
                        }
                        return n.a.createElement("div", {
                            className: "actionCell"
                        }, I, this.store.showViewPoll && n.a.createElement(R, {
                            config: a,
                            league: o,
                            store: this.store,
                            intl: i,
                            guest: r,
                            topic: c,
                            url: v,
                            getUpdatedTopics: _
                        }))
                    }
                }]);
                return t
            }(n.a.Component);
            var ee = t["a"] = Object(o["observer"])(Z)
        },
        326: function (e, t, a) {
            "use strict";
            a.d(t, "a", function () {
                return O
            });
            var r = a(0);
            var n = a.n(r);
            var o = a(19);
            var i = a.n(o);
            var s = a(1);
            var l = a.n(s);
            var c = a(2);
            var u = a(94);
            var d = a.n(u);
            var p = a(15);
            var f = a.n(p);

            function m(e) {
                m = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return m(e)
            }

            function g(e) {
                return _(e) || y(e) || v()
            }

            function v() {
                throw new TypeError("Invalid attempt to spread non-iterable instance")
            }

            function y(e) {
                if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
            }

            function _(e) {
                if (Array.isArray(e)) {
                    for (var t = 0, a = new Array(e.length); t < e.length; t++) a[t] = e[t];
                    return a
                }
            }

            function b(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function h(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function T(e, t, a) {
                t && h(e.prototype, t);
                a && h(e, a);
                return e
            }

            function w(e, t) {
                if (t && ("object" === m(t) || "function" === typeof t)) return t;
                return E(e)
            }

            function M(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function E(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            var O = "x";
            var I = Object(c["h"])({
                date: {
                    id: "waiver_report_date_label",
                    defaultMessage: "dddd, MMM. DD, YYYY"
                }
            });
            var S = function (e) {
                M(t, e);

                function t(e) {
                    var a;
                    b(this, t);
                    a = w(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    a.onChange_WaiverDropdown = a.props.onChange ? a.onChange_WaiverDropdown.bind(E(a)) : null;
                    return a
                }
                T(t, [{
                    key: "onChange_WaiverDropdown",
                    value: function e(t) {
                        this.props.onChange(t.target.value)
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.intl,
                            r = t.label,
                            i = t.waiverDates;
                        var s = this.props.value;
                        var l = null;
                        if (d()(i) > 0) {
                            var c = [];
                            if (!s) {
                                s = 0;
                                c = [{
                                    title: "Select a date",
                                    value: 0
                                }]
                            }
                            c = g(c).concat(g(i.map(function (e) {
                                var t = e.count,
                                    a = e.date;
                                return {
                                    count: t,
                                    date: a,
                                    momentDate: f.a.utc(a)
                                }
                            }).sort(function (e, t) {
                                return t.momentDate.valueOf() - e.momentDate.valueOf()
                            }).map(function (e) {
                                var t = e.count,
                                    r = e.momentDate;
                                return {
                                    title: "".concat(r.format(a.formatMessage(I.date)), " (").concat(t, ")"),
                                    value: r.format(O)
                                }
                            })));
                            l = n.a.createElement(o["Dropdown"], {
                                label: r,
                                labelPos: "above",
                                onChange: this.onChange_WaiverDropdown,
                                fillWidth: true,
                                value: s
                            }, c.map(function (e) {
                                var t = e.title,
                                    a = e.value;
                                return n.a.createElement(o["DropdownOption"], {
                                    key: a,
                                    title: t,
                                    value: a
                                })
                            }))
                        }
                        return l
                    }
                }]);
                return t
            }(n.a.Component);
            t["b"] = S
        },
        344: function (e, t, a) {
            "use strict";
            var r = a(14);
            var n = a.n(r);
            var o = a(5);
            var i = a.n(o);
            var s = a(0);
            var l = a.n(s);
            var c = a(2);
            var u = a(7);
            var d = a(15);
            var p = a.n(d);
            var f = a(3);
            var m = a(4);
            var g = a.n(m);
            var v = a(1);
            var y = a.n(v);
            var _ = a(77);
            var b = a.n(_);
            var h = a(97);
            var T = a.n(h);
            var w = a(44);
            var M = a(18);
            var E = a.n(M);
            var O = a(13);
            var I = function (e, t) {
                if (isNaN(e) || isNaN(t) || 0 === t) return "0%";
                e = parseInt(e, 10);
                t = parseInt(t, 10);
                return "".concat(Math.round(e / t * 100), "%")
            };
            var S = a(29);
            var j = a(261);
            var x = a(9);
            var C = a.n(x);
            var P = a(6);
            var D = a.n(P);

            function k(e) {
                k = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return k(e)
            }

            function A(e) {
                return function () {
                    var t = this,
                        a = arguments;
                    return new Promise(function (r, n) {
                        var o = e.apply(t, a);

                        function i(e, t) {
                            try {
                                var a = o[e](t);
                                var i = a.value
                            } catch (e) {
                                n(e);
                                return
                            }
                            a.done ? r(i) : Promise.resolve(i).then(s, l)
                        }

                        function s(e) {
                            i("next", e)
                        }

                        function l(e) {
                            i("throw", e)
                        }
                        s()
                    })
                }
            }

            function N(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function L(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function R(e, t, a) {
                t && L(e.prototype, t);
                a && L(e, a);
                return e
            }

            function V(e, t) {
                if (t && ("object" === k(t) || "function" === typeof t)) return t;
                return Y(e)
            }

            function F(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function Y(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function B() {
                B = Object.assign || function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var a = arguments[t];
                        for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r])
                    }
                    return e
                };
                return B.apply(this, arguments)
            }
            var U = "VOTE_PER_OWNER";
            var q = Object(c["h"])({
                header: {
                    id: "lm_poll_header",
                    defaultMessage: "League Manager's Poll"
                },
                voteButton: {
                    id: "lm_poll_vote_button",
                    defaultMessage: "Vote"
                },
                createPollText: {
                    id: "lm_poll_create_poll_text",
                    defaultMessage: "Create a Poll"
                },
                editPollText: {
                    id: "lm_poll_edit_poll_text",
                    defaultMessage: "Edit Poll"
                },
                votingRestrictionType: {
                    id: "lm_poll_voting_options",
                    defaultMessage: "{ type, select,\n\t\t\tVOTE_PER_OWNER {One Vote per Owner}\n\t\t\tVOTE_PER_TEAM {One Vote per Team}\n\t\t}"
                },
                votingErrorText: {
                    id: "lm_poll_voting_error_text",
                    defaultMessage: "There was an error while voting on LM Poll. Please try again."
                },
                voteCount: {
                    id: "lm_poll_vote_count",
                    defaultMessage: "{numberOfVotes} {numberOfVotes, plural, =1 {VOTE} other {VOTES}}"
                },
                votedInfoText: {
                    id: "lm_poll_voted_info_text",
                    defaultMessage: "{ type, select,\n\t\t\tVOTE_PER_OWNER {You voted on}\n\t\t\tVOTE_PER_TEAM {Your team voted on}\n\t\t}"
                },
                totalVoteText: {
                    id: "lm_poll_total_vote_text",
                    defaultMessage: "Total votes: {votesReceived}"
                }
            });
            var H = Object(f["observer"])(function (e) {
                var t = e.onChange,
                    a = e.pollOptions;
                var r = [];
                a.forEach(function (e, a) {
                    var n = e.value;
                    r.push(l.a.createElement(h["RadioOption"], {
                        label: n,
                        value: n,
                        onChange: t,
                        className: "poll-option-value mb4 n8 fw-medium",
                        key: a
                    }))
                });
                return l.a.createElement(b.a, {
                    className: "mb0 respond-trade-options"
                }, l.a.createElement(h["RadioGroup"], {
                    name: "respond-lm-poll-options"
                }, r))
            });
            var z = Object(f["observer"])(function (e) {
                var t = e.intl,
                    a = e.isPreview,
                    r = e.createPollStore,
                    n = e.onChange,
                    o = e.onClick_Vote,
                    i = e.store;
                var s = i.isButtonDisabled,
                    c = i.topic;
                var u = a ? r.pollType : c.poll.type;
                var d = a ? r.choices : c.poll.options;
                return l.a.createElement(l.a.Fragment, null, l.a.createElement(X, {
                    isPreview: a,
                    topic: c,
                    createPollStore: r
                }), l.a.createElement(H, {
                    onChange: n,
                    pollOptions: d
                }), l.a.createElement(w["b"], {
                    className: "vote-button mb1",
                    disabled: s,
                    onClick: !a && o
                }, t.formatMessage(q.voteButton)), l.a.createElement("div", {
                    className: "lm-poll-type mb3 mt3 tl"
                }, "(", t.formatMessage(q.votingRestrictionType, {
                    type: u
                }), ")"))
            });
            var W = Object(f["observer"])(function (e) {
                var t = e.intl,
                    a = e.value,
                    r = e.resultPercentage,
                    n = e.numberOfVotes;
                return l.a.createElement("div", {
                    className: "mb4"
                }, l.a.createElement("div", {
                    className: "poll-value mb2"
                }, a), l.a.createElement("div", {
                    className: "bar-container flex justify-between items-baseline"
                }, l.a.createElement("div", {
                    className: i.a.dynamic([
                        ["961929408", [r]]
                    ]) + " lm-poll-result-content mr3"
                }, l.a.createElement(i.a, {
                    styleId: "961929408",
                    css: [".lm-poll-result-content.__jsx-style-dynamic-selector{background-color:#F1F2F3;border-radius:5px;width:225px;display:inline-block;}", ".poll-value{font-size:11px;font-weight:500;color:#151617;-webkit-letter-spacing:0;-moz-letter-spacing:0;-ms-letter-spacing:0;letter-spacing:0;text-align:left;text-transform:uppercase;}", ".lm-poll-result-content.__jsx-style-dynamic-selector .lm-poll-result-bar.__jsx-style-dynamic-selector{border-radius:5px;width:".concat(r, ";height:10px;display:block;}"), ".lm-poll-vote-count{font-size:10px;color:#A5A6A7;}", ".vote-info-text{font-size:12px;color:#1D1E1F;}"],
                    dynamic: [r]
                }), l.a.createElement("span", {
                    className: i.a.dynamic([
                        ["961929408", [r]]
                    ]) + " lm-poll-result-bar bg-clr-link"
                })), l.a.createElement("span", null, r)), l.a.createElement("span", {
                    className: "lm-poll-vote-count"
                }, t.formatMessage(q.voteCount, {
                    numberOfVotes: n
                })))
            });
            var G = Object(f["observer"])(function (e) {
                var t = e.intl,
                    a = e.isLeagueManager,
                    r = e.isPreview,
                    n = e.createPollStore,
                    o = e.config,
                    i = e.leagueId,
                    s = e.store;
                var c = s.topic,
                    u = s.alreadyVoted,
                    d = s.votedDate;
                var p = D()(c, "poll", {}),
                    f = p.options,
                    m = p.votesReceived,
                    g = p.type;
                return l.a.createElement(l.a.Fragment, null, l.a.createElement(X, {
                    isPreview: r,
                    topic: c,
                    createPollStore: n
                }), f.map(function (e, a) {
                    var r = e.value,
                        n = e.voterIds;
                    var o = n ? n.length : 0;
                    var i = I(o, m);
                    return l.a.createElement(W, B({
                        key: a
                    }, {
                        value: r,
                        resultPercentage: i,
                        intl: t,
                        numberOfVotes: o
                    }))
                }), l.a.createElement("div", {
                    className: "vote-info-text mt6 mb5 flex flex-column"
                }, u && l.a.createElement("div", {
                    className: "mb1"
                }, t.formatMessage(q.votedInfoText, {
                    type: g
                }), " ", d), l.a.createElement("div", null, t.formatMessage(q.totalVoteText, {
                    votesReceived: m
                }), l.a.createElement("span", {
                    className: "mh1"
                }, "(", t.formatMessage(q.votingRestrictionType, {
                    type: g
                }), ")"))), a && l.a.createElement(J, {
                    config: o,
                    intl: t,
                    leagueId: i,
                    isEditLink: true
                }))
            });
            var J = function e(t) {
                var a = t.config,
                    r = t.intl,
                    n = t.leagueId,
                    o = t.isEditLink,
                    i = void 0 !== o && o;
                return l.a.createElement("div", {
                    className: g()({
                        "edit-poll-link pt4 tc": i
                    })
                }, l.a.createElement(E.a, {
                    to: "/".concat(a.uri_nextgen_ui, "/tools/createpoll?leagueId=").concat(n)
                }, r.formatMessage(i ? q.editPollText : q.createPollText)))
            };
            var X = Object(f["observer"])(function (e) {
                var t = e.isPreview,
                    a = e.topic,
                    r = e.createPollStore;
                return l.a.createElement("div", {
                    className: "lm-poll-question mb4 tl"
                }, t ? r.content : a.content)
            });
            var K = function (e) {
                F(t, e);

                function t(e) {
                    var a;
                    N(this, t);
                    a = V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    var r = e.guest.profile.swid,
                        n = e.league,
                        o = e.topic;
                    a.ownerSwid = r;
                    var i = n.teams.find(function (e) {
                        return e.isOwner(a.ownerSwid)
                    });
                    a.store = Object(u["observable"])({
                        topic: o,
                        alreadyVoted: Object(u["computed"])(function () {
                            if (o && i) return o.poll.type === U ? a.checkForAlreadyVoted(a.ownerSwid) : a.checkForAlreadyVoted(a.team.id.toString())
                        }),
                        isPollCreator: Object(u["computed"])(function () {
                            return o && r === o.author
                        }),
                        pollResponse: null,
                        selectedChoice: null,
                        isButtonDisabled: true,
                        votedDate: Object(u["computed"])(function () {
                            return o && i && (o.poll.type === U ? a.getVotedDate(a.ownerSwid) : a.getVotedDate(a.team.id && a.team.id.toString()))
                        })
                    });
                    a.onChange = a.onChange.bind(Y(a));
                    a.onClick_Vote = a.onClick_Vote.bind(Y(a));
                    a.team = i;
                    return a
                }
                R(t, [{
                    key: "getVotedDate",
                    value: function e(t) {
                        var a = this.checkForAlreadyVoted(t);
                        return p()(a && a.voteDatesByVoterId[t]).format("MMMM D")
                    }
                }, {
                    key: "checkForAlreadyVoted",
                    value: function e(t) {
                        var a = this.store.topic;
                        return C()(a && a.poll.options, function (e) {
                            var a = e.voterIds;
                            return a && a.indexOf(t) > -1
                        })
                    }
                }, {
                    key: "onClick_Vote",
                    value: function () {
                        var e = A(n.a.mark(function e() {
                            var t, a, r, o, i, s, d, p, f, m, g, v, y;
                            return n.a.wrap(function e(n) {
                                while (1) switch (n.prev = n.next) {
                                    case 0:
                                        t = this.props, a = t.config, r = t.intl, o = t.league;
                                        i = o.id, s = o.seasonId;
                                        d = this.store, p = d.selectedChoice, f = d.topic;
                                        m = f.id;
                                        g = f.poll.type === U ? this.ownerSwid : this.team.id;
                                        v = {
                                            options: [{
                                                value: p,
                                                voterIds: [g]
                                            }]
                                        };
                                        n.prev = 6;
                                        n.next = 9;
                                        return Object(O["U"])({
                                            config: a,
                                            leagueId: i,
                                            seasonId: s,
                                            topicId: m,
                                            data: v
                                        });
                                    case 9:
                                        y = n.sent;
                                        Object(u["runInAction"])(function () {
                                            f.poll = y
                                        });
                                        if (!this.props.getUpdatedTopics) {
                                            n.next = 14;
                                            break
                                        }
                                        n.next = 14;
                                        return this.props.getUpdatedTopics({
                                            config: a,
                                            intl: r,
                                            leagueId: i,
                                            seasonId: s
                                        });
                                    case 14:
                                        n.next = 19;
                                        break;
                                    case 16:
                                        n.prev = 16;
                                        n.t0 = n["catch"](6);
                                        Object(S["b"])({
                                            message: l.a.createElement(c["b"], q.votingErrorText),
                                            error: true
                                        });
                                    case 19:
                                    case "end":
                                        return n.stop()
                                }
                            }, e, this, [
                                [6, 16]
                            ])
                        }));
                        return function t() {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "onChange",
                    value: function e(t) {
                        var a = this;
                        Object(u["runInAction"])(function () {
                            a.store.isButtonDisabled = false;
                            a.store.selectedChoice = t.target.value
                        })
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.config,
                            r = t.intl,
                            n = t.guest,
                            o = t.league,
                            s = t.createPollStore,
                            c = t.isPreview,
                            u = t.url.query;
                        var d = this.store,
                            p = d.topic,
                            f = d.alreadyVoted,
                            m = d.isPollCreator;
                        var g = o.hasLeagueManagerPowers(n);
                        var v = r.formatMessage(q.header);
                        var y = "";
                        var _ = {
                            config: a,
                            createPollStore: s,
                            intl: r,
                            isPreview: c,
                            leagueId: parseInt(u.leagueId, 10),
                            store: this.store,
                            topic: p
                        };
                        c || (!p || p.isDeleted ? y = l.a.createElement(J, _) : (!this.team || f || m && !D()(p, "poll.allowCreatorVote")) && (y = l.a.createElement(G, B({
                            isLeagueManager: g
                        }, _))));
                        !c && y || (y = l.a.createElement(z, B({
                            onChange: this.onChange,
                            onClick_Vote: this.onClick_Vote
                        }, _)));
                        return l.a.createElement(j["a"], {
                            ariaLabel: v
                        }, l.a.createElement(j["d"], {
                            title: v
                        }), l.a.createElement(j["b"], null, l.a.createElement("div", {
                            className: "jsx-462561669 lm-poll-content"
                        }, l.a.createElement(i.a, {
                            styleId: "462561669",
                            css: [".lm-poll-content.jsx-462561669{font-size:12px;color:#1D1E1F;-webkit-letter-spacing:0;-moz-letter-spacing:0;-ms-letter-spacing:0;letter-spacing:0;word-wrap:break-word;}", ".lm-poll-content.jsx-462561669 .lm-poll-question{font-size:20px;white-space:pre-wrap;}", ".lm-poll-content.jsx-462561669 .vote-button{width:100px;margin-top:6px;}", ".lm-poll-content.jsx-462561669 .edit-poll-link{color:#0066CC;}", ".lm-poll-content.jsx-462561669 .poll-option-value{min-height:16px;}", ".lm-poll-content.jsx-462561669 .control--radio .control__indicator{top:0;}"]
                        }), y)))
                    }
                }]);
                return t
            }(l.a.Component);
            var $ = t["a"] = Object(f["observer"])(K)
        },
        359: function (e, t, a) {
            "use strict";
            t["a"] = function (e) {
                return [e.transactionDraftTradeAccept, e.transactionTradeAcceptTrade, e.transactionDraftTradeProcessed, e.transactionLMTradeVeto, e.transactionLMTradeVetoDraftTrade, e.transactionTradeAccept, e.transactionTradeVeto, e.transactionTradeVetoTrade, e.transactionTradeVetoDraftTrade, e.transactionTradeUphold, e.transactionTradeUpholdTrade, e.transactionTradeUpholdDraftTrade, e.transactionTradeProcessed, e.transactionTradeProcessedTrade]
            }
        },
        372: function (e, t, a) {
            "use strict";
            var r = a(0);
            var n = a.n(r);
            var o = a(2);
            var i = a(32);
            var s = function e(t) {
                var a = t.title;
                return n.a.createElement("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    xmlns: "http://www.w3.org/2000/svg",
                    xmlnsXlink: "http://www.w3.org/1999/xlink"
                }, a && n.a.createElement("title", null, a), n.a.createElement("g", {
                    fill: "none",
                    fillRule: "evenodd"
                }, n.a.createElement("circle", {
                    fill: "#079A3E",
                    cx: "10",
                    cy: "10",
                    r: "10"
                }), n.a.createElement("circle", {
                    stroke: "#038735",
                    cx: "10",
                    cy: "10",
                    r: "9.5"
                }), n.a.createElement("g", {
                    fill: "#FFF"
                }, n.a.createElement("path", {
                    d: "M10.6 9.4V7H9.4v2.4H7v1.2h2.4V13h1.2v-2.4H13V9.4"
                }))))
            };
            var l = s;
            var c = function e(t) {
                var a = t.title;
                return n.a.createElement("svg", {
                    id: "Layer_1",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 23.1 23.1"
                }, a && n.a.createElement("title", null, a), n.a.createElement("g", {
                    transform: "translate(0 -3)"
                }, n.a.createElement("circle", {
                    cx: "10.1",
                    cy: "13.1",
                    r: "9",
                    fill: "#079a3e",
                    id: "a"
                })), n.a.createElement("path", {
                    d: "M10.1 22.1c-5 0-9-4-9-9s4-9 9-9 9 4 9 9c0 4.9-4.1 9-9 9zm0-17c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z",
                    fill: "#038735",
                    transform: "translate(0 -3)"
                }), n.a.createElement("g", {
                    transform: "translate(11 11)"
                }, n.a.createElement("circle", {
                    cx: "5.6",
                    cy: "5.6",
                    r: "4.5",
                    fill: "#ec1c25",
                    id: "b"
                })), n.a.createElement("path", {
                    d: "M5.6 10.1c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2.1 4.5-4.5 4.5zm0-8c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5-1.6-3.5-3.5-3.5z",
                    fill: "#d5131b",
                    transform: "translate(11 11)"
                }), n.a.createElement("path", {
                    fill: "#fff",
                    d: "M5.6 11.1c-3 0-5.5-2.5-5.5-5.5S2.6.1 5.6.1s5.5 2.5 5.5 5.5-2.5 5.5-5.5 5.5zm0-10c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5S8 1.1 5.6 1.1z",
                    transform: "translate(11 11)"
                }), n.a.createElement("g", null, n.a.createElement("path", {
                    fill: "#fff",
                    d: "M10.7 9.5V7.1H9.5v2.4H7.1v1.2h2.4v2.4h1.2v-2.4h2.4V9.5m2 6.6h3v1h-3"
                })))
            };
            var u = c;
            var d = function e(t) {
                var a = t.title;
                return n.a.createElement("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    xmlns: "http://www.w3.org/2000/svg",
                    xmlnsXlink: "http://www.w3.org/1999/xlink"
                }, a && n.a.createElement("title", null, a), n.a.createElement("g", {
                    fill: "none",
                    fillRule: "evenodd"
                }, n.a.createElement("path", {
                    fill: "#EC1C25",
                    d: "M10 20c5.523 0 10-4.477 10-10 0-3.123-1.432-5.912-3.674-7.745C14.602.845 12.4 0 10 0 4.477 0 0 4.477 0 10s4.477 10 10 10z"
                }), n.a.createElement("path", {
                    stroke: "#D5131B",
                    d: "M10 19.5c5.247 0 9.5-4.253 9.5-9.5 0-2.89-1.297-5.564-3.49-7.358C14.324 1.264 12.22.5 10 .5 4.753.5.5 4.753.5 10s4.253 9.5 9.5 9.5z"
                }), n.a.createElement("g", {
                    fill: "#FFF"
                }, n.a.createElement("path", {
                    d: "M7 9h6v1.5H7"
                }))))
            };
            var p = d;
            var f = function e(t) {
                var a = t.title;
                return n.a.createElement("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    xmlns: "http://www.w3.org/2000/svg",
                    xmlnsXlink: "http://www.w3.org/1999/xlink"
                }, a && n.a.createElement("title", null, a), n.a.createElement("g", {
                    fill: "none",
                    fillRule: "evenodd"
                }, n.a.createElement("circle", {
                    fill: "#BDBDBD",
                    cx: "10",
                    cy: "10",
                    r: "10"
                }), n.a.createElement("circle", {
                    stroke: "#ADADAD",
                    cx: "10",
                    cy: "10",
                    r: "9.5"
                }), n.a.createElement("g", {
                    fill: "#FFF"
                }, n.a.createElement("path", {
                    d: "M8 11.8H6V7H5v6h3v-1.2zM15 7h-1.2L12 10l-1.8-3H9v6h1.2V9.4l1.2 2.4h1.2l1.2-2.4V13H15V7z"
                }))))
            };
            var m = f;
            var g = function e(t) {
                var a = t.title;
                return n.a.createElement("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    xmlns: "http://www.w3.org/2000/svg",
                    xmlnsXlink: "http://www.w3.org/1999/xlink"
                }, a && n.a.createElement("title", null, a), n.a.createElement("g", {
                    fill: "none",
                    fillRule: "evenodd"
                }, n.a.createElement("circle", {
                    fill: "#BDBDBD",
                    cx: "10",
                    cy: "10",
                    r: "10"
                }), n.a.createElement("circle", {
                    stroke: "#ADADAD",
                    cx: "10",
                    cy: "10",
                    r: "9.5"
                }), n.a.createElement("g", {
                    fill: "#FFF"
                }, n.a.createElement("path", {
                    d: "M5 15V9c0-1.5 1.5-3 3-3h7v4c0 1.5-1.5 3-3 3H8l-3 2zm6.75-4.5c.205 0 .382-.073.53-.218.146-.146.22-.323.22-.532 0-.21-.074-.386-.22-.532-.148-.145-.325-.218-.53-.218-.205 0-.382.073-.53.218-.146.146-.22.323-.22.532 0 .21.074.386.22.532.148.145.325.218.53.218zm-4.014 0c.21 0 .39-.073.54-.218.15-.146.224-.323.224-.532 0-.21-.075-.386-.225-.532-.15-.145-.33-.218-.54-.218-.2 0-.37.073-.517.218C7.073 9.364 7 9.54 7 9.75c0 .21.073.386.218.532.146.145.318.218.518.218zm2.028 0c.2 0 .372-.073.518-.218.145-.146.218-.323.218-.532 0-.21-.073-.386-.218-.532C10.136 9.073 9.964 9 9.764 9c-.21 0-.39.073-.54.218-.15.146-.224.323-.224.532 0 .21.075.386.225.532.15.145.33.218.54.218z"
                }))))
            };
            var v = g;
            var y = function e(t) {
                var a = t.fill,
                    r = void 0 === a ? "none" : a,
                    o = t.title;
                return n.a.createElement("svg", {
                    width: "20",
                    height: "20",
                    xmlns: "http://www.w3.org/2000/svg",
                    xmlnsXlink: "http://www.w3.org/1999/xlink"
                }, o && n.a.createElement("title", null, o), n.a.createElement("g", {
                    fill: r,
                    fillRule: "evenodd"
                }, n.a.createElement("circle", {
                    fill: "#2F6BC8",
                    cx: "10",
                    cy: "10",
                    r: "10"
                }), n.a.createElement("circle", {
                    stroke: "#2059B2",
                    cx: "10",
                    cy: "10",
                    r: "9.5"
                }), n.a.createElement("g", {
                    fill: "#FFF"
                }, n.a.createElement("path", {
                    d: "M8.327 5L6 7.646l.4.458.164.188 1.709 1.958.563-.646-1.309-1.5h5.51v-.917h-5.51l1.346-1.541zM11.09 10.396l1.31 1.5H6.891v.916h5.51l-1.346 1.542.563.646 2.31-2.646-2.273-2.604z"
                }))))
            };
            var _ = y;
            var b = function e(t) {
                var a = t.title;
                return n.a.createElement("svg", {
                    width: "20",
                    height: "20",
                    xmlns: "http://www.w3.org/2000/svg",
                    xmlnsXlink: "http://www.w3.org/1999/xlink"
                }, a && n.a.createElement("title", null, a), n.a.createElement("g", {
                    fill: "none",
                    fillRule: "evenodd"
                }, n.a.createElement("circle", {
                    fill: "#BDBDBD",
                    cx: "10",
                    cy: "10",
                    r: "10"
                }), n.a.createElement("circle", {
                    stroke: "#ADADAD",
                    cx: "10",
                    cy: "10",
                    r: "9.5"
                }), n.a.createElement("g", {
                    fill: "#FFF"
                }, n.a.createElement("path", {
                    d: "M12.922 5.823c.114.32.103.636-.034.95l-.663 1.5-2.157-1.052.664-1.5c.143-.314.368-.528.673-.643.306-.116.608-.103.908.04.292.15.495.385.61.705zm-1.039 3.195l-1.727 3.88L8 15v-3.144l1.737-3.89 2.146 1.052z"
                }))))
            };
            var h = b;
            var T = a(306);
            var w = a(9);
            var M = a.n(w);
            var E = a(16);
            var O = a.n(E);
            var I = a(48);
            a.d(t, "a", function () {
                return V
            });

            function S(e) {
                S = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return S(e)
            }

            function j() {
                j = Object.assign || function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var a = arguments[t];
                        for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r])
                    }
                    return e
                };
                return j.apply(this, arguments)
            }

            function x(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function C(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function P(e, t, a) {
                t && C(e.prototype, t);
                a && C(e, a);
                return e
            }

            function D(e, t) {
                if (t && ("object" === S(t) || "function" === typeof t)) return t;
                return k(e)
            }

            function k(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function A(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            var N = Object(o["h"])({
                transaction: {
                    id: "recent_activity_type_transaction",
                    defaultMessage: "Transaction"
                },
                freeAgentAdd: {
                    id: "recent_activity_type_transaction_faAdd",
                    defaultMessage: "Add {isLMTransaction, select, true {(By LM)} other {(FA)}}"
                },
                freeAgentDrop: {
                    id: "recent_activity_type_transaction_faDrop",
                    defaultMessage: "Drop {isLMTransaction, select, true {(By LM)} other {(FA)}}"
                },
                draftRecap: {
                    id: "recent_activity_type_transaction_draft",
                    defaultMessage: "Draft completed."
                },
                waiversAdd: {
                    id: "recent_activity_type_transaction_waiversAdd",
                    defaultMessage: "Add (Waivers)"
                },
                waiversDrop: {
                    id: "recent_activity_type_transaction_waiversDrop",
                    defaultMessage: "Drop (Waivers)"
                },
                addedDropped: {
                    id: "recent_activity_type_transaction_added_dropped",
                    defaultMessage: "Added/Dropped {isLMTransaction, select, true {(By LM)} other {}}"
                },
                tradeUpheld: {
                    id: "recent_activity_type_transaction_tradeUpheld",
                    defaultMessage: "Trade Upheld (by LM)"
                },
                tradeProcessed: {
                    id: "recent_activity_type_transaction_tradeProcessed",
                    defaultMessage: "Trade Processed {isLMTransaction, select, true {(By LM)} other {}}"
                },
                tradeAccepted: {
                    id: "recent_activity_type_transaction_tradeAccepted",
                    defaultMessage: "Trade Accepted"
                },
                tradeFailedRosterLock: {
                    id: "recent_activity_type_transaction_trade_failed_roster_lock",
                    defaultMessage: "Trade Failed, Roster Locked"
                },
                tradeReview: {
                    id: "recent_activity_type_transaction_tradeReview",
                    defaultMessage: "Trade Review"
                },
                tradeVeto: {
                    id: "recent_activity_type_transaction_tradeVeto",
                    defaultMessage: "Trade Vetoed"
                },
                tradeVetoLM: {
                    id: "recent_activity_type_transaction_tradeVeto_LM",
                    defaultMessage: "Trade Vetoed (by LM)"
                },
                lmActions: {
                    id: "recent_activity_type_lmAction",
                    defaultMessage: "LM Actions"
                },
                userPostedChat: {
                    id: "recent_activity_type_chat_userPosted",
                    defaultMessage: "{authorTeam} Posted"
                },
                newLMNote: {
                    id: "recent_activity_type_lmNote",
                    defaultMessage: "New LM Note"
                },
                deletedLMNote: {
                    id: "recent_activity_type_lmNote_deleted",
                    defaultMessage: "Deleted LM Note"
                },
                rosterUpdate: {
                    id: "recent_activity_type_rosterUpdate",
                    defaultMessage: "Roster Update {isLMTransaction, select, true {(By LM)} other {}}"
                },
                leagueSettingsUpdated: {
                    id: "recent_activity_type_leagueSettingsUpdated",
                    defaultMessage: "League rules updated"
                },
                teamsAndDivisionsUpdate: {
                    id: "recent_activity_type_teamsAndDivisionsUpdate",
                    defaultMessage: "Teams and divisions updated"
                },
                scoringUpdated: {
                    id: "recent_activity_type_scoringUpdated",
                    defaultMessage: "Scoring categories updated"
                },
                recentActivitySettingTypeDraftComplete: {
                    id: "recentActivitySettingTypeDraftComplete",
                    defaultMessage: "Draft completed."
                },
                recentActivitySettingTypeDraftReset: {
                    id: "recentActivitySettingTypeDraftReset",
                    defaultMessage: "Draft reset."
                },
                recentActivitySettingTypeTeamAndDivision: {
                    id: "recentActivitySettingTypeTeamAndDivision",
                    defaultMessage: "Teams and divisions updated."
                },
                recentActivitySettingTypeMembers: {
                    id: "recentActivitySettingTypeMembers",
                    defaultMessage: "League members updated."
                },
                recentActivitySettingTypeRosters: {
                    id: "recentActivitySettingTypeRosters",
                    defaultMessage: "Roster settings updated."
                },
                recentActivitySettingTypeScoring: {
                    id: "recentActivitySettingTypeScoring",
                    defaultMessage: "Scoring categories updated."
                },
                recentActivitySettingTypeSchedule: {
                    id: "recentActivitySettingTypeSchedule",
                    defaultMessage: "League schedule updated."
                },
                recentActivitySettingScheduleReset: {
                    id: "recentActivitySettingScheduleReset",
                    defaultMessage: "League schedule reset."
                },
                recentActivitySettingTypeTeams: {
                    id: "recentActivitySettingTypeTeams",
                    defaultMessage: "Team information updated."
                },
                recentActivitySettingTypeOwners: {
                    id: "recentActivitySettingTypeOwners",
                    defaultMessage: "Team owners updated."
                },
                recentActivitySettingTypeDraft: {
                    id: "recentActivitySettingTypeDraft",
                    defaultMessage: "Draft settings updated."
                },
                recentActivitySettingTypeDraftProgress: {
                    id: "recentActivitySettingTypeDraftProgress",
                    defaultMessage: "Draft in progress"
                },
                recentActivityDeclineDraftTrade: {
                    id: "recentActivityDeclineDraftTrade",
                    defaultMessage: "Draft trade declined"
                },
                lmPollUpdated: {
                    id: "lmPollUpdated",
                    defaultMessage: "League Manager Poll {actionPerformed}"
                },
                recentActivityMatchupAdjustScore: {
                    id: "recentActivityMatchupAdjustScore",
                    defaultMessage: "Scoring Adjustment"
                },
                unknownUser: {
                    id: "message_thread_unknown_user",
                    defaultMessage: "Anonymous"
                }
            });
            var L = {
                recentActivitySettingTypeDraftComplete: [119],
                recentActivitySettingTypeDraftReset: [121],
                recentActivitySettingTypeTeamAndDivision: [105, 106, 107, 108, 162, 163, 164, 165, 166],
                recentActivitySettingTypeMembers: [127, 128, 129],
                recentActivitySettingTypeScoring: [144, 145, 146, 147, 148, 149, 150],
                recentActivitySettingTypeSchedule: [138, 139, 140, 141, 142, 143],
                recentActivitySettingTypeTeams: [167, 168, 169, 170, 171, 172],
                recentActivitySettingTypeOwners: [165, 166],
                recentActivitySettingTypeRosters: [131, 132, 133, 134, 135, 136, 137, 188],
                recentActivitySettingTypeDraft: [111, 112, 113, 114, 115, 116, 117, 118],
                recentActivitySettingTypeDraftProgress: [120]
            };
            var R = function e(t) {
                var a = t.teams,
                    r = t.to;
                var n = "";
                if (r) {
                    var o = M()(a, {
                        id: r
                    });
                    o && (n = o.abbrev)
                }
                return n
            };
            var V = function (e) {
                A(t, e);

                function t() {
                    x(this, t);
                    return D(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
                }
                P(t, [{
                    key: "buildTransactionCell",
                    value: function e() {
                        var t = this.props,
                            a = t.message,
                            r = t.teams,
                            s = t.context,
                            c = t.config.constants.communication.communicationTypes,
                            d = t.showIconOnly;
                        var f = a.messages || a.items;
                        var m = c.draftStatusDraftComplete,
                            g = c.transactionDraftTradeAccept,
                            v = c.transactionDraftTradeProcessed,
                            y = c.transactionFreeAgentAdd,
                            b = c.transactionFreeAgentDrop,
                            T = c.transactionLMTradeVeto,
                            w = c.transactionLMTradeVetoTrade,
                            M = c.transactionLMTradeVetoDraftTrade,
                            E = c.transactionRoster,
                            O = c.transactionRosterDrop,
                            I = c.transactionTradeAccept,
                            S = c.transactionTradeAcceptTrade,
                            x = c.transactionTradeProcessed,
                            C = c.transactionTradeProcessedTrade,
                            P = c.transactionTradeUphold,
                            D = c.transactionTradeUpholdDraftTrade,
                            k = c.transactionTradeUpholdTrade,
                            A = c.transactionTradeVeto,
                            L = c.transactionTradeVetoTrade,
                            V = c.transactionTradeVetoDraftTrade,
                            F = c.transactionWaiverAdd,
                            Y = c.transactionWaiverDrop,
                            B = c.transactionFailedTradeRosterLock;
                        var U = null;
                        var q = null;
                        var H = false;
                        var z = false;
                        var W = false;
                        var G = n.a.createElement(o["b"], N.transaction);
                        f.forEach(function (e) {
                            var t = e.for,
                                a = e.isAlternateFormat,
                                s = e.messageTypeId;
                            W = a;
                            if (s === y) {
                                H = true;
                                U = U || n.a.createElement(l, null);
                                q = n.a.createElement(o["b"], j({}, N.freeAgentAdd, {
                                    values: {
                                        isLMTransaction: a
                                    }
                                }))
                            } else if (s === b) {
                                z = true;
                                U = U || n.a.createElement(p, null);
                                q = n.a.createElement(o["b"], j({}, N.freeAgentDrop, {
                                    values: {
                                        isLMTransaction: a
                                    }
                                }))
                            } else if (s === F) {
                                H = true;
                                U = U || n.a.createElement(l, null);
                                q = n.a.createElement(o["b"], N.waiversAdd)
                            } else if (s === Y) {
                                z = true;
                                U = U || n.a.createElement(p, null);
                                q = n.a.createElement(o["b"], N.waiversDrop)
                            } else if (s === m) {
                                U = n.a.createElement(l, null);
                                q = n.a.createElement(o["b"], N.draftRecap)
                            } else if (s === E) {
                                var c = R({
                                    teams: r,
                                    to: t
                                });
                                U = n.a.createElement(h, null);
                                q = n.a.createElement("span", null, c);
                                G = n.a.createElement(o["b"], j({}, N.rosterUpdate, {
                                    values: {
                                        isLMTransaction: a
                                    }
                                }))
                            } else if (e.type === i["y"].toUpperCase()) {
                                U = n.a.createElement(_, null);
                                q = null
                            } else if (e.type === i["b"].toUpperCase()) {
                                H = true;
                                U = U || n.a.createElement(l, null)
                            } else if (e.type === i["i"].toUpperCase() || s === O) {
                                z = true;
                                U = U || n.a.createElement(p, null);
                                q = n.a.createElement(o["b"], j({}, N.freeAgentDrop, {
                                    values: {
                                        isLMTransaction: a
                                    }
                                }))
                            } else if (s === I || s === S || s === g) {
                                U = n.a.createElement(_, null);
                                q = n.a.createElement(o["b"], N.tradeAccepted)
                            } else if (s === P || s === D || s === k) {
                                U = n.a.createElement(_, null);
                                q = n.a.createElement(o["b"], N.tradeUpheld)
                            } else if (s === A || s === L || s === V) {
                                U = n.a.createElement(_, null);
                                q = n.a.createElement(o["b"], N.tradeVeto)
                            } else if (s === T || s === M || s === w) {
                                U = n.a.createElement(_, null);
                                q = n.a.createElement(o["b"], N.tradeVetoLM)
                            } else if (s === x || s === C || s === v) {
                                U = n.a.createElement(_, null);
                                q = n.a.createElement(o["b"], j({}, N.tradeProcessed, {
                                    values: {
                                        isLMTransaction: a
                                    }
                                }))
                            } else if (s === B) {
                                U = n.a.createElement(_, {
                                    fill: "red"
                                });
                                q = n.a.createElement(o["b"], N.tradeFailedRosterLock)
                            }
                        });
                        if (H && z) {
                            U = n.a.createElement(u, null);
                            q = n.a.createElement(o["b"], j({}, N.addedDropped, {
                                values: {
                                    isLMTransaction: W
                                }
                            }))
                        }
                        if (a.type === i["z"] || a.type === i["C"]) {
                            U = n.a.createElement(_, null);
                            s && "tradereview" === s && (q = n.a.createElement(o["b"], N.tradeReview))
                        }
                        return n.a.createElement("div", {
                            className: "typeCell"
                        }, n.a.createElement("div", {
                            className: "typeCellIcon"
                        }, U), !d && n.a.createElement("div", {
                            className: "typeInfo"
                        }, G, q))
                    }
                }, {
                    key: "buildLMActionCell",
                    value: function e() {
                        var t = this.props.message;
                        var a = t.messages;
                        var r = n.a.createElement(o["b"], N.leagueSettingsUpdated);
                        var i = n.a.createElement(o["b"], N.lmActions);
                        a && a.forEach(function (e) {
                            var t = e.messageTypeId;
                            Object.keys(L).forEach(function (e) {
                                var a = L[e];
                                a.includes(t) && (i = n.a.createElement(o["b"], {
                                    id: N[e].id,
                                    defaultMessage: N[e].defaultMessage
                                }))
                            })
                        });
                        return n.a.createElement("div", {
                            className: "typeCell"
                        }, n.a.createElement("div", {
                            className: "typeCellIcon"
                        }, n.a.createElement(m, null)), n.a.createElement("div", {
                            className: "typeInfo"
                        }, i, r))
                    }
                }, {
                    key: "buildMessageCell",
                    value: function e() {
                        var t = this.props,
                            a = t.config,
                            r = t.guest,
                            i = t.intl,
                            s = t.league,
                            l = t.members,
                            c = t.message,
                            u = c.messages.author,
                            d = c.subject,
                            p = t.query;
                        var f = Object(I["a"])({
                            config: a,
                            guest: r,
                            league: s,
                            query: p
                        });
                        var m = M()(l, {
                            id: u
                        });
                        !m && s.hasLeagueManagerPowers(r) && r.profile.swid === u && (m = r && r.profile);
                        var g = m && m.firstName ? "".concat(m.firstName, " ").concat(m.lastName) : i.formatMessage(N.unknownUser);
                        var y = null;
                        y = u !== r.profile.swid || isNaN(f) ? M()(s.teams, function (e) {
                            return O()(e.owners, u)
                        }) : M()(s.teams, {
                            id: f
                        });
                        var _ = y && y.nickname ? "(".concat(y.location, " ").concat(y.nickname, ")") : "";
                        var b = "".concat(g, " ").concat(_);
                        return n.a.createElement("div", {
                            className: "typeCell type-ugc"
                        }, n.a.createElement("div", {
                            className: "typeCellIcon"
                        }, n.a.createElement(v, null)), n.a.createElement("div", {
                            className: "typeInfo"
                        }, n.a.createElement(o["b"], j({
                            values: {
                                authorTeam: b
                            }
                        }, N.userPostedChat)), d))
                    }
                }, {
                    key: "buildLMNoteCell",
                    value: function e() {
                        var t = this.props.message,
                            a = t.content,
                            r = t.subject;
                        var i = null;
                        i = "" === a || " " === a ? n.a.createElement(o["b"], N.deletedLMNote) : n.a.createElement(o["b"], N.newLMNote);
                        return n.a.createElement("div", {
                            className: "typeCell type-ugc"
                        }, n.a.createElement("div", {
                            className: "typeCellIcon"
                        }, n.a.createElement(m, null)), n.a.createElement("div", {
                            className: "typeInfo"
                        }, i, r))
                    }
                }, {
                    key: "buildLMPollCell",
                    value: function e() {
                        var t = this.props.message;
                        var a = null;
                        var r = null;
                        if (t.isDeleted) {
                            r = "Deleted";
                            a = n.a.createElement(o["b"], j({
                                values: {
                                    actionPerformed: r
                                }
                            }, N.lmPollUpdated))
                        } else {
                            r = "Created";
                            a = n.a.createElement(o["b"], j({
                                values: {
                                    actionPerformed: r
                                }
                            }, N.lmPollUpdated))
                        }
                        return n.a.createElement("div", {
                            className: "typeCell type-ugc"
                        }, n.a.createElement("div", {
                            className: "typeCellIcon"
                        }, n.a.createElement(v, null)), n.a.createElement("div", {
                            className: "typeInfo"
                        }, a))
                    }
                }, {
                    key: "buildLMAdjustScoringCell",
                    value: function e() {
                        var t = this.props.message.messages;
                        var a = this.props.config.constants.communication,
                            r = a.communicationTypes,
                            i = a.communicationTypes,
                            s = i.modifiedSchedule,
                            l = i.resetSchedule,
                            c = i.transactionLMMatchupAdjustmentChange;
                        var u = Object(T["b"])(r, t);
                        var d = null;
                        for (var p = 0, f = t.length; p < f; p++) {
                            var g = t[p].messageTypeId;
                            var v = void 0;
                            u ? g === c && (v = n.a.createElement(o["b"], N.recentActivityMatchupAdjustScore)) : g === s ? v = n.a.createElement(o["b"], N.recentActivitySettingTypeSchedule) : g === l && (v = n.a.createElement(o["b"], N.recentActivitySettingScheduleReset));
                            if (v) {
                                var y = n.a.createElement(o["b"], N.lmActions);
                                d = n.a.createElement("div", {
                                    className: "typeCell"
                                }, n.a.createElement("div", {
                                    className: "typeCellIcon"
                                }, n.a.createElement(m, null)), n.a.createElement("div", {
                                    className: "typeInfo"
                                }, y, v));
                                break
                            }
                        }
                        return d
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props.type;
                        var a = null;
                        "ACTIVITY_TRANSACTIONS" === t || t === i["C"] || t === i["J"] || t === i["z"] ? a = this.buildTransactionCell() : "ACTIVITY_SETTINGS" === t || "ACTIVITY_STATUS" === t ? a = this.buildLMActionCell() : "MSG_BOARD" === t ? a = this.buildMessageCell() : "NOTE" === t ? a = this.buildLMNoteCell() : "POLL" === t ? a = this.buildLMPollCell() : "ACTIVITY_SCHEDULE" === t && (a = this.buildLMAdjustScoringCell());
                        return a
                    }
                }]);
                return t
            }(n.a.Component)
        },
        373: function (e, t, a) {
            "use strict";
            var r = a(5);
            var n = a.n(r);
            var o = a(0);
            var i = a.n(o);
            var s = a(2);
            var l = a(32);
            var c = a(9);
            var u = a.n(c);
            var d = a(7);
            var p = a(15);
            var f = a.n(p);
            var m = a(18);
            var g = a.n(m);

            function v(e) {
                v = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return v(e)
            }

            function y(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function _(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function b(e, t, a) {
                t && _(e.prototype, t);
                a && _(e, a);
                return e
            }

            function h(e, t) {
                if (t && ("object" === v(t) || "function" === typeof t)) return t;
                return T(e)
            }

            function T(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function w(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            var M = Object(s["h"])({
                messageType_default: {
                    id: "messageType_default",
                    defaultMessage: "League settings updated."
                },
                messageType_100: {
                    id: "messageType_100",
                    defaultMessage: "Season acquisition limit have been changed."
                },
                messageType_101: {
                    id: "messageType_101",
                    defaultMessage: "Matchup acquisition limits have been changed."
                },
                messageType_102: {
                    id: "messageType_102",
                    defaultMessage: "Changed minimum bid amount from {from} to {to}."
                },
                messageType_103: {
                    id: "messageType_103",
                    defaultMessage: "Changed Player Acquisition System from {from} to {to}"
                },
                messageType_103_option_0: {
                    id: "messageType_103_option_0",
                    defaultMessage: "Free Agent"
                },
                messageType_103_option_1: {
                    id: "messageType_103_option_1",
                    defaultMessage: "Waivers"
                },
                messageType_103_option_2: {
                    id: "messageType_103_option_2",
                    defaultMessage: "FAAB"
                },
                messageType_104: {
                    id: "messageType_104",
                    defaultMessage: "Changed waiver period from {from} to {to} hours."
                },
                messageType_105: {
                    id: "messageType_105",
                    defaultMessage: "Added division {to}."
                },
                messageType_106_option_0: {
                    id: "messageType_106_option_0",
                    defaultMessage: "Added division {to}"
                },
                messageType_106_option_1: {
                    id: "messageType_106_option_1",
                    defaultMessage: "Removed division {to}"
                },
                messageType_107: {
                    id: "messageType_107",
                    defaultMessage: "Removed division {divisionName}"
                },
                messageType_108: {
                    id: "messageType_108",
                    defaultMessage: "Division updated."
                },
                messageType_109: {
                    id: "messageType_109",
                    defaultMessage: "Changed current season keeper count from {from} to {to}."
                },
                messageType_110_option_1: {
                    id: "messageType_110_option_1",
                    defaultMessage: "Made current keeper date {to}."
                },
                messageType_110_option_2: {
                    id: "messageType_110_option_2",
                    defaultMessage: "Deleted current keeper date."
                },
                messageType_110_option_3: {
                    id: "messageType_110_option_3",
                    defaultMessage: "Changed current keeper date from {from} to {to}."
                },
                messageType_111_option_1: {
                    id: "messageType_111_option_1",
                    defaultMessage: "Made draft time {to}."
                },
                messageType_111_option_2: {
                    id: "messageType_111_option_2",
                    defaultMessage: "Deleted draft time. No draft scheduled."
                },
                messageType_111_option_3: {
                    id: "messageType_111_option_3",
                    defaultMessage: "Changed draft time from {from} to {to}."
                },
                messageType_111_option_4: {
                    id: "messageType_111_option_4",
                    defaultMessage: "Draft was reset by the LM. No draft time has been scheduled."
                },
                messageType_112: {
                    id: "messageType_112",
                    defaultMessage: "Changed next season keeper count from {from} to {to}."
                },
                messageType_113_option_1: {
                    id: "messageType_113_option_1",
                    defaultMessage: "Made future keeper date {to}."
                },
                messageType_113_option_2: {
                    id: "messageType_113_option_2",
                    defaultMessage: "Deleted future keeper date."
                },
                messageType_113_option_3: {
                    id: "messageType_113_option_3",
                    defaultMessage: "Changed future keeper date from {from} to {to}."
                },
                messageType_114: {
                    id: "messageType_114",
                    defaultMessage: "Modified draft order."
                },
                messageType_115: {
                    id: "messageType_115",
                    defaultMessage: "Changed draft order type from {from} to {to}."
                },
                messageType_115_option_0: {
                    id: "messageType_115_option_0",
                    defaultMessage: "Manually Set by League Manager"
                },
                messageType_115_option_2: {
                    id: "messageType_115_option_2",
                    defaultMessage: "Randomized One Hour Prior to Draft Time"
                },
                messageType_116: {
                    id: "messageType_116",
                    defaultMessage: "Changed time per draft selection from {from} to {to} seconds."
                },
                messageType_117: {
                    id: "messageType_117",
                    defaultMessage: "Changed draft pick trading."
                },
                messageType_118_option_0: {
                    id: "messageType_118_option_0",
                    defaultMessage: "Changed draft type to offline."
                },
                messageType_118_option_1: {
                    id: "messageType_118_option_1",
                    defaultMessage: "Changed draft type to live."
                },
                messageType_118_option_2: {
                    id: "messageType_118_option_2",
                    defaultMessage: "Changed draft type to autopick."
                },
                messageType_118_option_4: {
                    id: "messageType_118_option_4",
                    defaultMessage: "Changed draft type to auction."
                },
                messageType_119: {
                    id: "messageType_119",
                    defaultMessage: "View results at {link}."
                },
                messageType_120: {
                    id: "messageType_120",
                    defaultMessage: "Draft in progress."
                },
                messageType_121: {
                    id: "messageType_121",
                    defaultMessage: "Draft reset."
                },
                messageType_122: {
                    id: "messageType_122",
                    defaultMessage: "Updated league fees."
                },
                messageType_124: {
                    id: "messageType_124",
                    defaultMessage: "League created."
                },
                messageType_125: {
                    id: "messageType_125",
                    defaultMessage: "League deleted."
                },
                messageType_127: {
                    id: "messageType_127",
                    defaultMessage: "Assigned LM powers to {to}."
                },
                messageType_128: {
                    id: "messageType_128",
                    defaultMessage: "{to} left."
                },
                messageType_129: {
                    id: "messageType_129",
                    defaultMessage: "Revoked LM powers from {to}."
                },
                messageType_131_option_0: {
                    id: "messageType_131_option_0",
                    defaultMessage: "Set Lineup Locktime to individually at gametime."
                },
                messageType_131_option_1: {
                    id: "messageType_131_option_1",
                    defaultMessage: "Set Lineup Locktime to all at first game of the day."
                },
                messageType_131_option_2: {
                    id: "messageType_131_option_2",
                    defaultMessage: "Set Lineup Locktime to all at 3AM ET."
                },
                messageType_131_option_4: {
                    id: "messageType_131_option_4",
                    defaultMessage: "Set Lineup Locktime to all at first game of the week."
                },
                messageType_132_option_0: {
                    id: "messageType_132_option_0",
                    defaultMessage: "Set Roster Locktime to individually at gametime.."
                },
                messageType_132_option_1: {
                    id: "messageType_132_option_1",
                    defaultMessage: "Set Roster Locktime to all at first game of the day."
                },
                messageType_132_option_2: {
                    id: "messageType_132_option_2",
                    defaultMessage: "Set Roster Locktime to all at 3AM ET."
                },
                messageType_132_option_3: {
                    id: "messageType_1312option_3",
                    defaultMessage: "Set Roster Locktime to all at first game of the week."
                },
                messageType_132_option_4: {
                    id: "messageType_132_option_4",
                    defaultMessage: "Set Roster Locktime to all at 3AM ET Monday."
                },
                messageType_133: {
                    id: "messageType_133",
                    defaultMessage: "Changed roster maximums for {targetId} from {from} to {to}."
                },
                messageType_134: {
                    id: "messageType_134",
                    defaultMessage: "Changed games played limit."
                },
                messageType_135: {
                    id: "messageType_135",
                    defaultMessage: "Changed number of slots for {targetId} from {from} to {to}."
                },
                messageType_136: {
                    id: "messageType_136",
                    defaultMessage: "Opted to observe ESPN's undroppable players list."
                },
                messageType_137: {
                    id: "messageType_137",
                    defaultMessage: "Changed universe to {to}."
                },
                messageType_138: {
                    id: "messageType_138",
                    defaultMessage: "Modified schedule."
                },
                messageType_139: {
                    id: "messageType_139",
                    defaultMessage: "Reset league schedule."
                },
                messageType_140: {
                    id: "messageType_140",
                    defaultMessage: "Changed number of weeks per playoff matchup from {from} to {to}."
                },
                messageType_141: {
                    id: "messageType_141",
                    defaultMessage: "Changed number of playoff teams from {from} to {to}."
                },
                messageType_143: {
                    id: "messageType_143",
                    defaultMessage: "Changed number of weeks in regular season from {from} to {to}."
                },
                messageType_144_option_1: {
                    id: "messageType_144_option_1",
                    defaultMessage: "Set Home Field Advantage to {to} point(s)."
                },
                messageType_144_option_2: {
                    id: "messageType_144_option_2",
                    defaultMessage: "Eliminated Home Field Advantage."
                },
                messageType_144_option_3: {
                    id: "messageType_144_option_3",
                    defaultMessage: "Changed Home Field Advantage from {to} to {from} point(s)."
                },
                messageType_145: {
                    id: "messageType_145",
                    defaultMessage: "Added scoring category {targetId}."
                },
                messageType_146: {
                    id: "messageType_146",
                    defaultMessage: "Changed scoring category {targetId} from {from} to {to} points."
                },
                messageType_147: {
                    id: "messageType_147",
                    defaultMessage: "Changed scoring category {targetId} from {from} to {to} points."
                },
                messageType_148: {
                    id: "messageType_148",
                    defaultMessage: "Removed scoring category {targetId}."
                },
                messageType_149: {
                    id: "messageType_149",
                    defaultMessage: "Set Regular Season Game Tie Breaker to {to}."
                },
                messageType_149_option_0: {
                    id: "messageType_149_option_0",
                    defaultMessage: "No tie breakers"
                },
                messageType_149_option_1: {
                    id: "messageType_149_option_1",
                    defaultMessage: "Home team wins"
                },
                messageType_149_option_2: {
                    id: "messageType_149_option_2",
                    defaultMessage: "Slot based"
                },
                messageType_149_option_3: {
                    id: "messageType_149_option_3",
                    defaultMessage: "Stat based"
                },
                messageType_149_option_4: {
                    id: "messageType_149_option_4",
                    defaultMessage: "Highest playoff seed"
                },
                messageType_150: {
                    id: "messageType_150",
                    defaultMessage: "Scoring type changed."
                },
                messageType_153: {
                    id: "messageType_153",
                    defaultMessage: "Made league hidden from public view."
                },
                messageType_154: {
                    id: "messageType_154",
                    defaultMessage: "Made league visible to public view."
                },
                messageType_156: {
                    id: "messageType_156",
                    defaultMessage: "Changed league name from {from} to {to}."
                },
                messageType_157_option_0: {
                    id: "messageType_157_option_0",
                    defaultMessage: "Made league hidden from public view."
                },
                messageType_157_option_1: {
                    id: "messageType_157_option_1",
                    defaultMessage: "Made league visible to public view."
                },
                messageType_160: {
                    id: "messageType_160",
                    defaultMessage: "Activated league."
                },
                messageType_161: {
                    id: "messageType_161",
                    defaultMessage: "Made season start date {to}"
                },
                messageType_162: {
                    id: "messageType_162",
                    defaultMessage: "Changed team {targetId} abbreviation from {from} to {to}."
                },
                messageType_163: {
                    id: "messageType_163",
                    defaultMessage: "Moved team {from} to division {to}."
                },
                messageType_164: {
                    id: "messageType_164",
                    defaultMessage: "Renamed team {from} to {to}."
                },
                messageType_165: {
                    id: "messageType_165",
                    defaultMessage: "Deleted owner {to} from team {from}."
                },
                messageType_166: {
                    id: "messageType_166",
                    defaultMessage: "{to} joined {from}."
                },
                messageType_167: {
                    id: "messageType_167",
                    defaultMessage: "Updated transaction counters for team {to}."
                },
                messageType_168: {
                    id: "messageType_168",
                    defaultMessage: "Team information updated"
                },
                messageType_169: {
                    id: "messageType_169",
                    defaultMessage: "Modified waiver order."
                },
                messageType_170: {
                    id: "messageType_170",
                    defaultMessage: "Added team {to}."
                },
                messageType_171: {
                    id: "messageType_171",
                    defaultMessage: "{from} joined {to}."
                },
                messageType_172: {
                    id: "messageType_172",
                    defaultMessage: "Deleted team {to}."
                },
                messageType_173: {
                    id: "messageType_173",
                    defaultMessage: "Trade settings updated"
                },
                messageType_174_option_1: {
                    id: "messageType_174_option_1",
                    defaultMessage: "Made trade deadline {to}."
                },
                messageType_174_option_2: {
                    id: "messageType_174_option_2",
                    defaultMessage: "Eliminated trade deadline."
                },
                messageType_174_option_3: {
                    id: "messageType_174_option_3",
                    defaultMessage: "Changed trade deadline from {from} to {to}."
                },
                messageType_175: {
                    id: "messageType_175",
                    defaultMessage: "Changed Trade Limit from {from} to {to}."
                },
                messageType_176: {
                    id: "messageType_176",
                    defaultMessage: "Changed Trade Review Period to {to}."
                },
                messageType_177: {
                    id: "messageType_177",
                    defaultMessage: "Set Votes Required to Veto Trade to {to}."
                },
                messageType_178: {
                    id: "messageType_178",
                    defaultMessage: "{toTeamName} added {playerName}, {proTeamAbbrev} {positionAbbrev} from Free Agency to {placement}"
                },
                messageType_179: {
                    id: "messageType_179",
                    defaultMessage: "{toTeamName} dropped {playerName}, {proTeamAbbrev} {positionAbbrev} from Free Agency to {placement}"
                },
                messageType_180: {
                    id: "messageType_180",
                    defaultMessage: "{toTeamName} added {playerName}, {proTeamAbbrev} {positionAbbrev} from Waivers to {placement}"
                },
                messageType_181: {
                    id: "messageType_181",
                    defaultMessage: "{toTeamName} dropped {playerName}, {proTeamAbbrev} {positionAbbrev} from Waivers to {placement}"
                },
                messageType_182: {
                    id: "messageType_182",
                    defaultMessage: "{teamName} Accepted Trade {userName}"
                },
                messageType_183: {
                    id: "messageType_183",
                    defaultMessage: "Declined Trade"
                },
                messageType_184: {
                    id: "messageType_184",
                    defaultMessage: "{userName} Proposed Trade"
                },
                messageType_185: {
                    id: "messageType_185",
                    defaultMessage: "Trade Upheld"
                },
                messageType_186: {
                    id: "messageType_186",
                    defaultMessage: "Trade Vetoed"
                },
                messageType_187: {
                    id: "messageType_187",
                    defaultMessage: "Trade Processed"
                },
                messageType_188: {
                    id: "messageType_188",
                    defaultMessage: "Roster Updated"
                },
                messageType_189: {
                    id: "messageType_189",
                    defaultMessage: "Draft"
                },
                messageType_190: {
                    id: "messageType_190",
                    defaultMessage: "Proposed Trade"
                },
                messageType_191: {
                    id: "messageType_191",
                    defaultMessage: "Reason: A position limit would be exceeded."
                },
                messageType_192: {
                    id: "messageType_192",
                    defaultMessage: ""
                },
                messageType_193: {
                    id: "messageType_193",
                    defaultMessage: "Reason: Did not clear waivers."
                },
                messageType_194: {
                    id: "messageType_194",
                    defaultMessage: "Reason: Roster locked."
                },
                messageType_195: {
                    id: "messageType_195",
                    defaultMessage: "Reason: Lineup locked."
                },
                messageType_196: {
                    id: "messageType_196",
                    defaultMessage: "Reason: Trade limit."
                },
                messageType_197: {
                    id: "messageType_197",
                    defaultMessage: "Reason: Acquisition limit would be exceeded."
                },
                messageType_198: {
                    id: "messageType_198",
                    defaultMessage: "Reason: Maximum slot size would be exceeded."
                },
                messageType_199: {
                    id: "messageType_199",
                    defaultMessage: "Reason: Ineligible slot."
                },
                messageType_200: {
                    id: "messageType_200",
                    defaultMessage: "Reason: {targetId} slot"
                },
                messageType_201: {
                    id: "messageType_201",
                    defaultMessage: "Reason: Maximum roster size would be exceeded."
                },
                messageType_202: {
                    id: "messageType_202",
                    defaultMessage: "Reason: Player has already been added to another team."
                },
                messageType_203: {
                    id: "messageType_203",
                    defaultMessage: "Reason: Transaction validation failed."
                },
                messageType_204: {
                    id: "messageType_204",
                    defaultMessage: "Reason: No permission."
                },
                messageType_205: {
                    id: "messageType_205",
                    defaultMessage: "Reason: You have a player in an invalid roster slot."
                },
                messageType_206: {
                    id: "messageType_206",
                    defaultMessage: "Cancel transaction."
                },
                messageType_207: {
                    id: "messageType_207",
                    defaultMessage: "Cancel Accepted Trade"
                },
                messageType_208: {
                    id: "messageType_208",
                    defaultMessage: "Reason: A player involved is undroppable."
                },
                messageType_209: {
                    id: "messageType_209",
                    defaultMessage: "Reason: A player involved is no longer eligible in your player universe."
                },
                messageType_210: {
                    id: "messageType_210",
                    defaultMessage: "Reason: A player you are attempting to drop is no longer on your roster."
                },
                messageType_211: {
                    id: "messageType_211",
                    defaultMessage: "Reason: A player is in your {targetId} slot."
                },
                messageType_212: {
                    id: "messageType_212",
                    defaultMessage: "Reason: Drop reserved player."
                },
                messageType_213: {
                    id: "messageType_213",
                    defaultMessage: "Reason: Matchup acquisition limit would be exceeded."
                },
                messageType_214: {
                    id: "messageType_214",
                    defaultMessage: "Reason: Auction budget would be exceeded."
                },
                messageType_215: {
                    id: "messageType_215",
                    defaultMessage: "Reason: Player not on roster."
                },
                messageType_216: {
                    id: "messageType_216",
                    defaultMessage: "Reason: Minimum bid would be exceeded."
                },
                messageType_217: {
                    id: "messageType_217",
                    defaultMessage: "Reason: Invalid format"
                },
                messageType_218_option_0: {
                    id: "messageType_142_option_0",
                    defaultMessage: "Set Playoff Seeding Tie Breaker to Head to Head Record."
                },
                messageType_218_option_1: {
                    id: "messageType_142_option_1",
                    defaultMessage: "Set Playoff Seeding Tie Breaker to Total Points For."
                },
                messageType_218_option_2: {
                    id: "messageType_142_option_2",
                    defaultMessage: "Set Playoff Seeding Tie Breaker to Intra Division Record."
                },
                messageType_218_option_3: {
                    id: "messageType_142_option_3",
                    defaultMessage: "Set Playoff Seeding Tie Breaker to Total Points Against."
                },
                messageType_221: {
                    id: "messageType_221",
                    defaultMessage: "Opted not to observe ESPN's undroppable players list."
                },
                messageType_223: {
                    id: "messageType_223",
                    defaultMessage: "{to} left the league."
                },
                messageType_239: {
                    id: "messageType_239",
                    defaultMessage: "{toTeamName} dropped {playerName}, {proTeamAbbrev} {positionAbbrev} from roster"
                },
                messageType_noLimit: {
                    id: "messageType_noLimit",
                    defaultMessage: "No Limit"
                },
                dateFormat: {
                    id: "messageType_dateFormat",
                    defaultMessage: "dddd, MMMM D, h:mm a"
                },
                draftRecap: {
                    id: "messageType_draftComplete_linkText",
                    defaultMessage: "Draft Recap"
                },
                lmOnlyVeto: {
                    id: "messageType_lmOnlyVeto",
                    defaultMessage: "LM Only Vetoes"
                },
                votes: {
                    id: "messageType_votes",
                    defaultMessage: "vote(s)"
                }
            });
            var E = i.a.createElement(s["b"], M.messageType_noLimit);
            var O = function (e) {
                w(t, e);

                function t(e) {
                    y(this, t);
                    return h(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                }
                b(t, [{
                    key: "parseValues",
                    value: function e(t) {
                        var a = this.props,
                            r = a.messageTypeId,
                            n = a.config,
                            o = a.intl,
                            s = a.league,
                            l = a.settings;
                        var c = n.constants,
                            p = c.lineupSlots,
                            m = c.universes,
                            v = c.statSettings.stats;
                        var y = t.targetId,
                            _ = t.to,
                            b = t.from;
                        var h = o.formatMessage(M.dateFormat);
                        var T = s.id;
                        if (r >= 133 && r <= 135) {
                            var w = u()(Object(d["toJS"])(p), {
                                id: y
                            });
                            var O = w.name; - 1 === _ ? t.to = E : -1 === b && (t.from = E);
                            O && (t.targetId = O)
                        } else if (r >= 145 && r <= 148) {
                            var I = u()(Object(d["toJS"])(v), {
                                id: y
                            });
                            var S = I.description; - 1 === _ ? t.to = E : -1 === b && (t.from = E);
                            S && (t.targetId = S)
                        } else if (105 === r || 106 === r || 163 === r) {
                            var j = l.scheduleSettings.divisions;
                            var x = u()(Object(d["toJS"])(j), {
                                id: _
                            });
                            x && (t.to = x.name)
                        } else if (137 === r) {
                            if (_) {
                                var C = /^.*?\[[^\d]*(\d+)[^\d]*\].*$/;
                                var P = C.exec(_);
                                if (P && 2 === P.length) {
                                    var D = parseInt(P[1], 10);
                                    var k = u()(m, {
                                        id: D
                                    });
                                    k && (t.to = k.abbrev)
                                }
                            }
                        } else if (174 === r || 113 === r || 111 === r || 110 === r) {
                            _ && -1 !== _ && (t.to = f()(_).format(h));
                            b && -1 !== b && (t.from = f()(b).format(h))
                        } else if (175 === r) {
                            _ && -1 === _ && (t.to = E);
                            b && -1 === b && (t.from = E)
                        } else if (103 === r || 115 === r || 149 === r) {
                            var A = "messageType_".concat(r, "_option");
                            void 0 !== _ && (t.to = o.formatMessage(M["".concat(A, "_").concat(_)]));
                            void 0 !== b && (t.from = o.formatMessage(M["".concat(A, "_").concat(b)]))
                        } else if (200 === r || 211 === r) {
                            var N = p.find(function (e) {
                                return e.injuryRequired
                            });
                            t.targetId = N.abbrev
                        } else if (119 === r) {
                            var L = i.a.createElement(g.a, {
                                to: "/".concat(n.uri_nextgen_ui, "/league/draftrecap?leagueId=").concat(T)
                            }, o.formatMessage(M.draftRecap));
                            t.link = L
                        } else if (177 === r) {
                            if (void 0 !== _ && 0 === _) _ = o.formatMessage(M.lmOnlyVeto);
                            else {
                                var R = o.formatMessage(M.votes);
                                _ = "".concat(_, " ").concat(R)
                            }
                            t.to = _
                        }
                        void 0 !== t.to && Number.isInteger(t.to) && (t.to = "".concat(t.to));
                        void 0 !== t.from && Number.isInteger(t.from) && (t.from = "".concat(t.from));
                        return t
                    }
                }, {
                    key: "updateKey",
                    value: function e(t) {
                        var a = this.props,
                            r = a.messageTypeId,
                            n = a.values,
                            o = n.to,
                            i = n.from;
                        var s = null;
                        174 === r || 144 === r ? s = o && -1 !== o && i && -1 !== i ? 3 : o && -1 !== o ? 1 : 2 : 113 === r || 111 === r || 110 === r ? s = o && -1 !== o && i && -1 !== i ? 3 : o && -1 !== o ? 1 : i && 1 === i ? 4 : 2 : 106 !== r && 118 !== r && 131 !== r && 218 !== r || (s = "".concat(o));
                        s && (t = "".concat(t, "_option_").concat(s));
                        return t
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.messageTypeId,
                            r = t.values;
                        var n = this.updateKey("messageType_".concat(a));
                        var o = M[n];
                        r = this.parseValues(r);
                        var l = null;
                        o && (l = i.a.createElement(s["b"], {
                            id: o.id,
                            defaultMessage: o.defaultMessage,
                            values: r
                        }));
                        return l
                    }
                }]);
                return t
            }(i.a.Component);
            var I = a(306);
            var S = a(454);
            var j = a(17);
            var x = a(304);
            var C = a(6);
            var P = a.n(C);
            var D = a(73);
            a.d(t, "a", function () {
                return H
            });

            function k(e) {
                k = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return k(e)
            }

            function A() {
                A = Object.assign || function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var a = arguments[t];
                        for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r])
                    }
                    return e
                };
                return A.apply(this, arguments)
            }

            function N(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function L(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function R(e, t, a) {
                t && L(e.prototype, t);
                a && L(e, a);
                return e
            }

            function V(e, t) {
                if (t && ("object" === k(t) || "function" === typeof t)) return t;
                return F(e)
            }

            function F(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function Y(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            var B = 165;
            var U = 128;
            var q = Object(s["h"])({
                noteDeleted: {
                    id: "recent_activity_detail_note_deleted",
                    defaultMessage: "The League Manager deleted the LM Note"
                },
                pollUpdated: {
                    id: "recent_activity_detail_lm_poll_updated",
                    defaultMessage: "{LM} {actionPerformed} the League Manager Poll"
                },
                lmAdjustScoringDetail: {
                    id: "lm_adjust_scoring",
                    defaultMessage: "LM adjusted score for {forTeamName} from {originalPts} pts to {adjustedPoints} pts in matchup against {toTeamName}"
                },
                lmAdjustScoringNote: {
                    id: "lm_adjust_scoring_note",
                    defaultMessage: "{adjustmentLabel}: {content}"
                }
            });
            var H = function (e) {
                Y(t, e);

                function t(e) {
                    N(this, t);
                    return V(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                }
                R(t, [{
                    key: "buildMessageDetail",
                    value: function e() {
                        var t = this.props,
                            a = t.config,
                            r = t.intl,
                            n = t.message,
                            o = t.type;
                        var s = a.communicationFilterTypes.lmNoteFilter;
                        var l;
                        l = n && n.messages ? n.messages.constructor === Array && n.messages.length > 0 ? n.messages[n.messages.length - 1].content : n.messages.content ? n.messages.content : o !== s || "" !== n.content && " " !== n.content ? n.content : r.formatMessage(q.noteDeleted) : n.content;
                        var c = null;
                        if (l) {
                            l = Object(x["a"])(l);
                            c = i.a.createElement("p", {
                                dangerouslySetInnerHTML: {
                                    __html: l
                                }
                            })
                        }
                        return c
                    }
                }, {
                    key: "buildSettingsDetail",
                    value: function e() {
                        var t = this.props,
                            a = t.config,
                            r = t.intl,
                            n = t.league,
                            o = t.message.messages,
                            s = t.members,
                            l = t.settings,
                            c = t.teams;
                        var d = [];
                        var p = u()(o, ["messageTypeId", B]);
                        o && o.forEach(function (e, t) {
                            var o = e.messageTypeId;
                            var u = {
                                to: e.to,
                                from: e.from,
                                targetId: e.targetId
                            };
                            var f = i.a.createElement(O, A({
                                key: t
                            }, {
                                config: a,
                                intl: r,
                                league: n,
                                members: s,
                                messageTypeId: o,
                                settings: l,
                                teams: c,
                                values: u
                            }));
                            p ? o !== U && d.push(f) : d.push(f)
                        });
                        return i.a.createElement("div", {
                            className: "transactionCell"
                        }, d.map(function (e) {
                            return e
                        }))
                    }
                }, {
                    key: "buildLMPollDetail",
                    value: function e() {
                        var t = this.props,
                            a = t.members,
                            r = t.intl,
                            n = t.message,
                            o = t.message.author;
                        var i = n.isDeleted ? "deleted" : "created";
                        var s = P()(u()(a, {
                            id: o
                        }), "name", "");
                        return r.formatMessage(q.pollUpdated, {
                            LM: s,
                            actionPerformed: i
                        })
                    }
                }, {
                    key: "buildLMAdjustScoringCell",
                    value: function e() {
                        var t = this.props,
                            a = t.config,
                            r = t.intl,
                            o = t.league,
                            l = t.members,
                            c = t.message.messages,
                            d = t.settings,
                            p = t.teams;
                        var f = a.constants.communication,
                            m = f.communicationTypes,
                            g = f.communicationTypes,
                            v = g.modifiedSchedule,
                            y = g.resetSchedule,
                            _ = g.transactionLMMatchupAdjustmentChange;
                        var b = [];
                        var h = Object(I["b"])(m, c);
                        for (var T = 0, w = c.length; T < w; T++) {
                            var M = c[T];
                            var E = M.messageTypeId;
                            if (h) {
                                if (E === _) {
                                    var S = c[T],
                                        x = S.for,
                                        C = S.targetId,
                                        P = S.content;
                                    var k = Object(j["a"])(c[T].from, o);
                                    var N = Object(j["a"])(c[T].to, o);
                                    var L = null;
                                    var R = null;
                                    if (x && C) {
                                        var V = u()(p, {
                                            id: x
                                        });
                                        var F = u()(p, {
                                            id: C
                                        });
                                        L = C ? i.a.createElement(D["a"], {
                                            league: o,
                                            team: V,
                                            config: a,
                                            logo: false
                                        }) : "";
                                        R = C ? i.a.createElement(D["a"], {
                                            league: o,
                                            team: F,
                                            config: a,
                                            logo: false
                                        }) : ""
                                    }
                                    b.push(i.a.createElement(s["b"], A({
                                        key: T
                                    }, {
                                        defaultMessage: r.formatMessage(q.lmAdjustScoringDetail),
                                        id: "lm_adjustment_message",
                                        values: {
                                            forTeamName: L,
                                            originalPts: k,
                                            adjustedPoints: N,
                                            toTeamName: R
                                        }
                                    })));
                                    if (P.length > 0) {
                                        var Y = i.a.createElement("span", {
                                            className: "fw-bold"
                                        }, i.a.createElement(s["b"], {
                                            id: "lm_adjustment_label",
                                            defaultMessage: "Adjustment Note"
                                        }));
                                        b.push(i.a.createElement(s["b"], A({
                                            key: T
                                        }, {
                                            defaultMessage: r.formatMessage(q.lmAdjustScoringNote),
                                            id: "lm_adjustment_note",
                                            values: {
                                                adjustmentLabel: Y,
                                                content: P
                                            }
                                        })))
                                    }
                                }
                            } else if (E === v || E === y) {
                                b.push(i.a.createElement(O, A({
                                    key: T
                                }, {
                                    config: a,
                                    intl: r,
                                    league: o,
                                    members: l,
                                    messageTypeId: E,
                                    settings: d,
                                    teams: p,
                                    values: {
                                        to: M.to,
                                        from: M.from,
                                        targetId: M.targetId
                                    }
                                })));
                                break
                            }
                        }
                        return i.a.createElement("span", {
                            className: "jsx-4269419020 lm_adjust_scoring transactionCell"
                        }, i.a.createElement(n.a, {
                            styleId: "4269419020",
                            css: [".lm_adjust_scoring.jsx-4269419020 .team--link{display:inline-block;}"]
                        }), b.map(function (e) {
                            return e
                        }))
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.config,
                            r = t.draftPicks,
                            n = t.members,
                            o = t.message,
                            s = t.playerPool,
                            c = t.teams,
                            u = t.type,
                            d = t.isConditional,
                            p = void 0 !== d && d,
                            f = t.isLeagueUsingFAAB,
                            m = void 0 !== f && f,
                            g = t.league,
                            v = t.showPlayerCard,
                            y = void 0 !== v && v,
                            _ = t.teamId;
                        var b = a.communicationFilterTypes,
                            h = b.lmNoteFilter,
                            T = b.messageBoardFilter,
                            w = b.settingsFilter,
                            M = b.statusFilter,
                            E = b.transactionsFilter,
                            O = b.pollFilter,
                            I = b.scheduleFilter;
                        var j = null;
                        var x = "recentActivityDetail";
                        if (u === w || u === M) j = this.buildSettingsDetail();
                        else if (u === E || u === l["C"] || u === l["z"] || u === l["J"]) j = i.a.createElement(S["a"], {
                            config: a,
                            draftPicks: r,
                            isConditional: p,
                            isLeagueUsingFAAB: m,
                            members: n,
                            playerPool: s,
                            teams: c,
                            transaction: o,
                            league: g,
                            showPlayerCard: y,
                            teamId: _
                        });
                        else if (u === T) {
                            j = this.buildMessageDetail();
                            x += " detail-ugc"
                        } else if (u === h) {
                            j = this.buildMessageDetail();
                            x += " detail-ugc"
                        } else if (u === O) {
                            j = this.buildLMPollDetail();
                            x += " detail-ugc"
                        } else u === I && (j = this.buildLMAdjustScoringCell());
                        return i.a.createElement("span", {
                            className: x
                        }, j)
                    }
                }]);
                return t
            }(i.a.Component)
        },
        38: function (e, t, a) {
            "use strict";
            t["a"] = s;
            t["b"] = l;
            var r = a(9);
            var n = a.n(r);
            var o = a(6);
            var i = a.n(o);

            function s(e) {
                var t = e.constants.segments;
                var a = i()(t, [0, "periodTypes"]);
                var r = n()(a, {
                    weekly: true
                });
                return r && r.periods || []
            }

            function l(e, t) {
                var a = s(e);
                for (var r = 0; r < a.length; r++) {
                    var n = a[r];
                    var o = n.scoringPeriodStart;
                    var i = n.scoringPeriodEnd;
                    if (o <= t && i >= t) return n
                }
                return {}
            }
        },
        42: function (e, t, a) {
            "use strict";
            a.d(t, "e", function () {
                return R
            });
            a.d(t, "a", function () {
                return V
            });
            a.d(t, "g", function () {
                return F
            });
            a.d(t, "b", function () {
                return Y
            });
            a.d(t, "c", function () {
                return B
            });
            a.d(t, "f", function () {
                return U
            });
            a.d(t, "d", function () {
                return q
            });
            a.d(t, "h", function () {
                return H
            });
            a.d(t, "i", function () {
                return z
            });
            t["x"] = W;
            t["n"] = G;
            t["t"] = J;
            t["s"] = X;
            t["y"] = K;
            t["r"] = $;
            t["j"] = Q;
            t["u"] = Z;
            t["m"] = ee;
            t["z"] = te;
            t["w"] = ae;
            t["k"] = re;
            t["v"] = ne;
            t["q"] = oe;
            t["o"] = ie;
            t["p"] = se;
            t["l"] = le;
            var r = a(9);
            var n = a.n(r);
            var o = a(24);
            var i = a.n(o);
            var s = a(6);
            var l = a.n(s);
            var c = a(34);
            var u = a.n(c);
            var d = a(60);
            var p = a(51);
            var f = a(23);
            var m = a.n(f);
            var g = a(218);
            var v = a.n(g);
            var y = a(12);
            var _ = a.n(y);
            var b = a(221);
            var h = a.n(b);
            var T = a(149);
            var w = a.n(T);
            var M = a(98);
            var E = a.n(M);
            var O = a(58);
            var I = a(10);
            var S = a.n(I);
            var j = a(40);
            var x = a(17);
            var C = a(75);
            var P = a(38);
            var D = a(13);
            var k = a(21);
            var A = a(48);
            var N = a(192);

            function L(e) {
                L = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return L(e)
            }
            var R = "scoringperiod";
            var V = "matchup";
            var F = "team";
            var Y = "overview";
            var B = "points";
            var U = "stats";
            var q = "projections";
            var H = [{
                id: U,
                message: "boxScoreTab",
                default: true
            }, {
                id: B,
                message: "scoringBreakdownTab"
            }];
            var z = {
                teamHeaderTypes: {
                    H2H: "h2h",
                    ROTO: "roto",
                    SINGLE_TEAM: "singleTeam"
                },
                CONTEXTS: {
                    boxscore: "boxscore",
                    fantasycast: "fantasycast"
                },
                H2H_VIEWS: [R, V, F],
                ROTO_VIEWS: [F, B, U]
            };

            function W(e, t) {
                var a = t && t.roster && t.roster.entries;
                var r;
                r = n()(a, function (t) {
                    return t.playerId === e.playerId
                });
                return r
            }

            function G(e, t) {
                var a;
                var r;
                if (e && e.length > 0) {
                    r = e[t];
                    r && (a = r[r.length - 1])
                }
                return a
            }

            function J(e) {
                var t = e.matchupTeam,
                    a = e.league,
                    r = e.view,
                    n = e.isByeMatchup,
                    o = e.config,
                    s = e.scoringPeriodId;
                var c = K(s, o, a);
                var u = l()(a, ["settings", "scheduleSettings", "matchupPeriods", c], []);
                var d = u.length > 1;
                var p = "",
                    f, m, g;
                if (t) {
                    var v = null;
                    a.isH2HPointsLeague ? v = c > a.currentMatchupPeriod && t.adjustmentPlusHomeTeamBonus ? t.adjustmentPlusHomeTeamBonus : l()(t, "totalPoints", 0) : a.isRoto || a.isPointsLeague ? v = t.points(r) : t.cumulativeScore && (p = Object(N["a"])(t.cumulativeScore, a));
                    if (null !== v) {
                        p = Object(x["a"])(v, a);
                        f = Object(x["b"])(v)
                    }
                }
                n && !a.isPointsLeague && (p = " ");
                if (d && s && a.isH2HPointsLeague) {
                    var y = Object(P["b"])(o, s);
                    var _ = w()(y.scoringPeriodStart, y.scoringPeriodEnd + 1);
                    g = i()(u, function (e) {
                        return e === y.id
                    }) + 1;
                    m = E()(_, function (e, a) {
                        return e + l()(t, ["pointsByScoringPeriod", a], 0)
                    }, 0);
                    m = parseFloat(Object(x["a"])(m, a))
                }
                return {
                    score: p,
                    rawScore: f,
                    weekScore: m,
                    weekNumber: g
                }
            }

            function X(e) {
                var t = e.config.currentSeason,
                    a = e.league,
                    r = e.scoringPeriodId,
                    n = e.team,
                    o = e.view;
                var i;
                if (n)
                    if (o === R) i = r <= a.latestScoringPeriodId ? n.rosterForCurrentScoringPeriod : {
                        players: l()(a, ["teamsMap", n.teamId, "rosterStore", "players"], [])
                    };
                    else if (o === V) {
                    var s = l()(Object(C["a"])({
                        league: a,
                        scoringPeriodId: r
                    }), "id");
                    var c = l()(Object(C["a"])({
                        league: a,
                        scoringPeriodId: a.latestScoringPeriodId
                    }), "id");
                    a.offSeason || a.seasonId < t || s < c ? i = n.rosterForMatchupPeriod : s === c && (i = n.rosterForMatchupPeriodDelayedLive)
                }
                return i
            }

            function K(e, t, a) {
                var r;
                var n = Object(P["b"])(t, e),
                    o = n.id,
                    i = void 0 === o ? null : o;
                var s = l()(a, "settings.scheduleSettings.matchupPeriods");
                if (null !== i && null !== s && "object" === L(s))
                    for (var c in s)
                        if (Array.isArray(s[c])) {
                            var u = s[c];
                            u.includes(i) && (r = c)
                        } return r || a.currentMatchupPeriod
            }

            function $(e, t) {
                var a = l()(e, "roster.entries", []);
                return u()(a.map(function (e) {
                    var a = l()(e, "playerPoolEntry.player");
                    return t[a.id]
                }), "proTeam.id")
            }

            function Q(e, t, a, r) {
                var n = e && e.schedule;
                var o = e && e.status;
                var i = e && e.latestScoringPeriodId;
                var s = u()(n, "matchupPeriodId");
                var l = o && o.currentMatchupPeriod;
                var c;
                t && 0 !== i && (c = r.scoringPeriodToMatchupPeriod(t, a, e));
                c || (c = l);
                return c && s[c] || []
            }

            function Z(e, t, a) {
                var r = l()(t, "profile.swid");
                var n = a && a.teams;
                var o = Object(A["a"])({
                    config: e,
                    guest: t,
                    league: a
                });
                return r && n && n.find(function (e) {
                    return e.id === o
                }) || void 0
            }

            function ee(e, t) {
                var a = ["home", "away"];
                var r = t && t.id;
                return r ? e.find(function (e) {
                    return !!a.find(function (t) {
                        return l()(e, [t, "teamId"]) === r
                    })
                }) : void 0
            }

            function te(e, t, a, r) {
                var n = t.pathname,
                    o = t.query;
                var i = {
                    scoringPeriodId: Object(p["a"])(Date.now(), r),
                    view: re(a)
                };
                var s = Object(I["mix"])({}, [o, h()(e, v.a)], {
                    noRecurse: true
                });
                var l;
                Object.keys(s).forEach(function (e) {
                    s[e] === i[e] && (s = _()(s, e))
                });
                if (!m()(o, s)) {
                    l = Object(O["a"])({
                        pathname: n,
                        query: s
                    });
                    j["a"].push(l, l, {
                        shallow: true
                    })
                }
            }

            function ae(e, t) {
                var a = parseInt(e.leagueId, 10);
                var r = Object(d["a"])({
                    config: t,
                    query: e
                });
                var n = z.H2H_VIEWS.includes(e.view) || z.ROTO_VIEWS.includes(e.view) ? e.view : void 0;
                var o = parseInt(e.teamId, 10);
                var i = e.matchupPeriodId ? Number(e.matchupPeriodId) : null;
                var s = e.scoringPeriodId ? parseInt(e.scoringPeriodId, 10) : Object(p["a"])(Date.now(), t);
                var l = e.fetchDataOnServer || false;
                var c = e.replayDate || e.date || null;
                return {
                    fetchDataOnServer: l,
                    leagueId: a,
                    matchupPeriodId: i,
                    replayDate: c,
                    scoringPeriodId: s,
                    seasonId: r,
                    teamId: o,
                    view: n
                }
            }

            function re() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                var t = e && e.isH2H;
                var a = B;
                a = t ? e && e.offSeason ? V : R : F;
                return a
            }

            function ne(e) {
                return !(e.home && e.away)
            }

            function oe(e) {
                var t = e.externalId,
                    a = void 0 === t ? null : t,
                    r = e.player,
                    n = e.statParams;
                var o = l()(r, "stats", {});
                if ("function" === typeof o) {
                    var i = r.stats(n.seasonId, n.scoringPeriodId, n.statSourceId, n.statSplitTypeId, a);
                    var s = i && i.rawStats || {};
                    return s
                }
                return a && r.gameStats ? r.gameStats[a] : o
            }

            function ie(e) {
                var t = e.config,
                    a = e.league,
                    r = e.player,
                    n = e.playerStats,
                    o = e.showFantasyPts,
                    i = e.stats;
                var s = l()(t, "constants.statSettings");
                var c = l()(s, "statsMap", {});
                var u = [];
                if (n && i) {
                    i.forEach(function (e) {
                        var t = n[e];
                        var a = c[e];
                        var r = a && a.abbrev;
                        var o = a && a.description;
                        r && "number" === typeof t && 0 !== t && u.push({
                            name: r,
                            displayValue: Object(k["c"])(s, n, a),
                            title: o
                        })
                    });
                    u = se({
                        config: t,
                        displayStats: u,
                        league: a,
                        player: r,
                        playerStats: n,
                        showFantasyPts: o
                    })
                }
                return u
            }

            function se(e) {
                var t = e.config,
                    a = e.displayStats,
                    r = e.league,
                    n = e.player,
                    o = e.playerStats,
                    i = e.showFantasyPts;
                var s = l()(r, "settings.scoringSettings", null);
                if (r.isH2HPointsLeague && i) {
                    var c = r.currentScoringPeriodId,
                        u = r.seasonId;
                    var d = Object(D["b"])(o, t, s, u, c, n);
                    0 === d || isNaN(d) || a.push({
                        name: "FPTS",
                        displayValue: Object(x["a"])(d, r)
                    })
                }
                return a
            }

            function le(e) {
                var t = e.proGame;
                return [l()(t, "recentPlay.text", "")]
            }
        },
        487: function (e, t, a) {
            "use strict";
            a.d(t, "a", function () {
                return _
            });
            var r = a(5);
            var n = a.n(r);
            var o = a(0);
            var i = a.n(o);
            var s = a(15);
            var l = a.n(s);
            var c = a(2);

            function u(e) {
                u = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return u(e)
            }

            function d(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function p(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function f(e, t, a) {
                t && p(e.prototype, t);
                a && p(e, a);
                return e
            }

            function m(e, t) {
                if (t && ("object" === u(t) || "function" === typeof t)) return t;
                return g(e)
            }

            function g(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function v(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            var y = Object(c["h"])({
                activityDate: {
                    id: "recent_activity_date",
                    defaultMessage: "ddd MMM D"
                },
                activityTime: {
                    id: "recent_activity_time",
                    defaultMessage: "h:mm a"
                }
            });
            var _ = function (e) {
                v(t, e);

                function t(e) {
                    d(this, t);
                    return m(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                }
                f(t, [{
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.date,
                            r = t.intl,
                            o = t.prefix,
                            s = void 0 === o ? "" : o;
                        var c = l()(a);
                        var u = c && c.format(r.formatMessage(y.activityDate));
                        var d = c && s + c.format(r.formatMessage(y.activityTime));
                        return i.a.createElement("div", {
                            className: "jsx-2820844873 activityDate"
                        }, i.a.createElement(n.a, {
                            styleId: "2820844873",
                            css: [".activityDateCell.jsx-2820844873>div.jsx-2820844873{display:block;}"]
                        }), i.a.createElement("div", {
                            className: "jsx-2820844873 date"
                        }, u), i.a.createElement("div", {
                            className: "jsx-2820844873 time"
                        }, d))
                    }
                }]);
                return t
            }(i.a.Component)
        },
        53: function (e, t, a) {
            "use strict";

            function r(e) {
                return i(e) || o(e) || n()
            }

            function n() {
                throw new TypeError("Invalid attempt to spread non-iterable instance")
            }

            function o(e) {
                if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
            }

            function i(e) {
                if (Array.isArray(e)) {
                    for (var t = 0, a = new Array(e.length); t < e.length; t++) a[t] = e[t];
                    return a
                }
            }
            t["a"] = function (e, t) {
                var a = e.matchupPeriods,
                    n = e.scoringPeriods,
                    o = void 0 === n ? [] : n;
                var i = t && a && a[t] || [];
                return i.reduce(function (e, t) {
                    return r(e).concat(r(o[t - 1] || []))
                }, [])
            }
        },
        573: function (e, t, a) {
            "use strict";
            t["a"] = function (e) {
                var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                var a = [e.transactionFailedWaiverClaim, e.transactionProposedDraftTrade, e.transactionProposeTrade, e.transactionTradeDeclined, e.transactionDraftTradeDecline, e.transactionTradeDeclineDrop, e.transactionTradeDeclinedTrade, e.transactionTradeProposed, e.transactionTradeProposedDrop];
                t && a.push(e.transactionRoster);
                return a
            }
        },
        574: function (e, t, a) {
            "use strict";
            var r = a(5);
            var n = a.n(r);
            var o = a(0);
            var i = a.n(o);
            var s = a(1);
            var l = a.n(s);
            var c = a(11);
            var u = a(8);
            var d = a(2);
            var p = a(19);
            var f = a.n(p);

            function m(e) {
                m = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return m(e)
            }

            function g(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function v(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function y(e, t, a) {
                t && v(e.prototype, t);
                a && v(e, a);
                return e
            }

            function _(e, t) {
                if (t && ("object" === m(t) || "function" === typeof t)) return t;
                return h(e)
            }

            function b(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function h(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            var T = Object(d["h"])({
                activityType: {
                    id: "league_recent_activity_filterLabel_activityType",
                    defaultMessage: "Activity Type"
                }
            });
            var w = function (e) {
                b(t, e);

                function t(e) {
                    var a;
                    g(this, t);
                    a = _(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    a.onChange = a.props.onChange ? a.onChange.bind(h(a)) : null;
                    return a
                }
                y(t, [{
                    key: "onChange",
                    value: function e(t) {
                        this.props.onChange({
                            updateType: "activityType",
                            updateValue: parseInt(t.target.value, 10)
                        })
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props.activityType;
                        var a = [{
                            value: "-1",
                            title: "All"
                        }, {
                            value: "0",
                            title: "LM Actions"
                        }, {
                            value: "1",
                            title: "LM Note"
                        }, {
                            value: "2",
                            title: "Transactions"
                        }, {
                            value: "3",
                            title: "Messages"
                        }];
                        var r = void 0 !== t ? t : -1;
                        var n = {
                            value: r,
                            onChange: this.onChange,
                            label: i.a.createElement(d["b"], T.activityType),
                            labelPos: "above",
                            fillWidth: true
                        };
                        return i.a.createElement(p["Dropdown"], n, a.map(function (e) {
                            return i.a.createElement(p["DropdownOption"], {
                                key: e.value,
                                value: e.value,
                                title: e.title
                            })
                        }))
                    }
                }]);
                return t
            }(i.a.Component);
            var M = a(15);
            var E = a.n(M);

            function O(e) {
                O = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return O(e)
            }

            function I(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function S(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function j(e, t, a) {
                t && S(e.prototype, t);
                a && S(e, a);
                return e
            }

            function x(e, t) {
                if (t && ("object" === O(t) || "function" === typeof t)) return t;
                return P(e)
            }

            function C(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function P(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            var D = Object(d["h"])({
                startDate: {
                    id: "recent_activity_filter_startDate",
                    defaultMessage: "Start Date"
                }
            });
            var k = 8;
            var A = function (e) {
                C(t, e);

                function t(e) {
                    var a;
                    I(this, t);
                    a = x(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    a.onChange = a.props.onChange ? a.onChange.bind(P(a)) : null;
                    return a
                }
                j(t, [{
                    key: "onChange",
                    value: function e(t) {
                        this.props.onChange({
                            updateType: "startDate",
                            updateValue: parseInt(t.target.value, 10)
                        })
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.league.status,
                            r = t.startDate,
                            n = t.endDate;
                        var o = a.activatedDate;
                        var s = new Date;
                        var l = new Date;
                        var c = [];
                        o || (o = E()().startOf("year").valueOf());
                        var u = new Date(o);
                        n && E()(s).format("YYYYMMDD") !== n && (s = E()(n, "YYYYMMDD").endOf("day").valueOf());
                        l = (new Date).setDate(l.getDate() - k);
                        var f = r || E()(l).format("YYYYMMDD");
                        var m = {
                            value: f,
                            onChange: this.onChange,
                            label: i.a.createElement(d["b"], D.startDate),
                            labelPos: "above",
                            fillWidth: true
                        };
                        while (u < s) {
                            var g = E()(u).format("MMM. D");
                            var v = E()(u).format("YYYYMMDD");
                            c.push({
                                value: v,
                                title: g
                            });
                            u = new Date(u.setDate(u.getDate() + 1))
                        }
                        return i.a.createElement(p["Dropdown"], m, c.map(function (e) {
                            return i.a.createElement(p["DropdownOption"], {
                                key: e.value,
                                value: e.value,
                                title: e.title
                            })
                        }))
                    }
                }]);
                return t
            }(i.a.Component);

            function N(e) {
                N = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return N(e)
            }

            function L(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function R(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function V(e, t, a) {
                t && R(e.prototype, t);
                a && R(e, a);
                return e
            }

            function F(e, t) {
                if (t && ("object" === N(t) || "function" === typeof t)) return t;
                return B(e)
            }

            function Y(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function B(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            var U = Object(d["h"])({
                endDate: {
                    id: "recent_activity_filter_endDate",
                    defaultMessage: "End Date"
                }
            });
            var q = function (e) {
                Y(t, e);

                function t(e) {
                    var a;
                    L(this, t);
                    a = F(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    a.onChange = a.props.onChange ? a.onChange.bind(B(a)) : null;
                    return a
                }
                V(t, [{
                    key: "onChange",
                    value: function e(t) {
                        this.props.onChange({
                            updateType: "endDate",
                            updateValue: parseInt(t.target.value, 10)
                        })
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.league.status.activatedDate,
                            r = t.endDate;
                        var n = new Date;
                        var o = r || E()(n).format("YYYYMMDD");
                        var s = {
                            value: o,
                            onChange: this.onChange,
                            label: i.a.createElement(d["b"], U.endDate),
                            labelPos: "above",
                            fillWidth: true
                        };
                        var l = a;
                        var c = [];
                        a || (l = E()().startOf("year").valueOf());
                        l = new Date(l);
                        while (l <= n) {
                            var u = E()(l);
                            var f = u.format("MMM. D");
                            var m = u.format("YYYYMMDD");
                            c.push({
                                value: m,
                                title: f
                            });
                            l = E()(u).add(1, "days").startOf("day").valueOf()
                        }
                        return i.a.createElement(p["Dropdown"], s, c.map(function (e) {
                            var t = e.title,
                                a = e.value;
                            return i.a.createElement(p["DropdownOption"], {
                                key: a,
                                title: t,
                                value: a
                            })
                        }))
                    }
                }]);
                return t
            }(i.a.Component);

            function H(e) {
                H = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return H(e)
            }

            function z(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function W(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function G(e, t, a) {
                t && W(e.prototype, t);
                a && W(e, a);
                return e
            }

            function J(e, t) {
                if (t && ("object" === H(t) || "function" === typeof t)) return t;
                return K(e)
            }

            function X(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function K(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            var $ = Object(d["h"])({
                team: {
                    id: "league_recent_activity_filterLabel_team",
                    defaultMessage: "Team"
                }
            });
            var Q = function (e) {
                X(t, e);

                function t(e) {
                    var a;
                    z(this, t);
                    a = J(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    a.onChange = a.props.onChange ? a.onChange.bind(K(a)) : null;
                    return a
                }
                G(t, [{
                    key: "onChange",
                    value: function e(t) {
                        this.props.onChange({
                            updateType: "teamId",
                            updateValue: parseInt(t.target.value, 10)
                        })
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.league.teams,
                            r = t.teamId,
                            n = t.activityType;
                        var o = r || -1;
                        var s = [];
                        var l = null;
                        var c = {
                            value: o,
                            onChange: this.onChange,
                            label: i.a.createElement(d["b"], $.team),
                            labelPos: "above"
                        };
                        if (a && a.length > 0 && 1 !== n && 0 !== n) {
                            s.push({
                                title: "All",
                                value: -1
                            });
                            a.forEach(function (e) {
                                s.push({
                                    title: "".concat(e.location, " ").concat(e.nickname),
                                    value: e.id
                                })
                            });
                            l = i.a.createElement(p["Dropdown"], c, s.map(function (e) {
                                return i.a.createElement(p["DropdownOption"], {
                                    key: e.value,
                                    value: e.value,
                                    title: e.title
                                })
                            }))
                        }
                        return l
                    }
                }]);
                return t
            }(i.a.Component);

            function Z(e) {
                Z = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return Z(e)
            }

            function ee(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function te(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function ae(e, t, a) {
                t && te(e.prototype, t);
                a && te(e, a);
                return e
            }

            function re(e, t) {
                if (t && ("object" === Z(t) || "function" === typeof t)) return t;
                return oe(e)
            }

            function ne(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function oe(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            var ie = Object(d["h"])({
                transactions: {
                    id: "recent_activity_filter_transactions",
                    defaultMessage: "Transactions"
                }
            });
            var se = -2;
            var le = 2;
            var ce = function (e) {
                ne(t, e);

                function t(e) {
                    var a;
                    ee(this, t);
                    a = re(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    a.onChange = a.props.onChange ? a.onChange.bind(oe(a)) : null;
                    return a
                }
                ae(t, [{
                    key: "onChange",
                    value: function e(t) {
                        this.props.onChange({
                            updateType: "transactionType",
                            updateValue: parseInt(t.target.value, 10)
                        })
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.activityType,
                            r = t.transactionType;
                        var n = r || se;
                        var o = [{
                            value: -2,
                            title: "All, Except Moved"
                        }, {
                            value: -1,
                            title: "All"
                        }, {
                            value: 1,
                            title: "Moved"
                        }, {
                            value: 2,
                            title: "Added"
                        }, {
                            value: 4,
                            title: "Traded"
                        }, {
                            value: 3,
                            title: "Dropped"
                        }];
                        var s = {
                            value: n,
                            onChange: this.onChange,
                            label: i.a.createElement(d["b"], ie.transactions),
                            labelPos: "above",
                            fillWidth: true
                        };
                        var l = null;
                        a === le && (l = i.a.createElement(p["Dropdown"], s, o.map(function (e) {
                            return i.a.createElement(p["DropdownOption"], {
                                key: e.value,
                                value: e.value,
                                title: e.title
                            })
                        })));
                        return l
                    }
                }]);
                return t
            }(i.a.Component);

            function ue(e) {
                ue = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return ue(e)
            }

            function de(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function pe(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function fe(e, t, a) {
                t && pe(e.prototype, t);
                a && pe(e, a);
                return e
            }

            function me(e, t) {
                if (t && ("object" === ue(t) || "function" === typeof t)) return t;
                return ge(e)
            }

            function ge(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function ve(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            var ye = function (e) {
                ve(t, e);

                function t(e) {
                    de(this, t);
                    return me(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                }
                fe(t, [{
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.league,
                            r = t.teamId,
                            n = t.activityType,
                            o = t.onChange,
                            s = t.startDate,
                            l = t.endDate,
                            c = t.transactionType;
                        var u = null;
                        a && (u = i.a.createElement("div", {
                            className: "filterDropdowns"
                        }, i.a.createElement(w, {
                            activityType: n,
                            onChange: o
                        }), i.a.createElement(A, {
                            league: a,
                            onChange: o,
                            startDate: s,
                            endDate: l
                        }), i.a.createElement(q, {
                            league: a,
                            onChange: o,
                            startDate: s,
                            endDate: l
                        }), i.a.createElement(Q, {
                            league: a,
                            teamId: r,
                            onChange: o,
                            activityType: n
                        }), i.a.createElement(ce, {
                            activityType: n,
                            transactionType: c,
                            onChange: o
                        })));
                        return u
                    }
                }]);
                return t
            }(i.a.Component);
            var _e = ye;
            var be = a(487);
            var he = a(372);
            var Te = a(373);
            var we = a(306);
            var Me = a(200);
            var Ee = a.n(Me);
            var Oe = a(52);
            var Ie = a.n(Oe);
            var Se = a(6);
            var je = a.n(Se);
            var xe = a(7);
            a.d(t, "a", function () {
                return Ue
            });

            function Ce(e) {
                Ce = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return Ce(e)
            }

            function Pe() {
                Pe = Object.assign || function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var a = arguments[t];
                        for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r])
                    }
                    return e
                };
                return Pe.apply(this, arguments)
            }

            function De(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function ke(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function Ae(e, t, a) {
                t && ke(e.prototype, t);
                a && ke(e, a);
                return e
            }

            function Ne(e, t) {
                if (t && ("object" === Ce(t) || "function" === typeof t)) return t;
                return Le(e)
            }

            function Le(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function Re(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            var Ve = Object(d["h"])({
                date: {
                    id: "recent_activity_heading_date",
                    defaultMessage: "DATE"
                },
                type: {
                    id: "recent_activity_heading_type",
                    defaultMessage: "TYPE"
                },
                detail: {
                    id: "recent_activity_heading_detail",
                    defaultMessage: "DETAIL"
                },
                action: {
                    id: "recent_activity_heading_action",
                    defaultMessage: "ACTION"
                },
                lmNoteType: {
                    id: "recent_activity_typeCol_lmNote",
                    defaultMessage: "New LM NOTE"
                },
                noActivityLabel: {
                    id: "no_activity_lable",
                    defaultMessage: "No activity matching the specified filters"
                }
            });
            var Fe = 4;
            var Ye = 7;
            var Be = "SeasonTransitionTaskProcessor";
            var Ue = function (e) {
                Re(t, e);

                function t() {
                    De(this, t);
                    return Ne(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
                }
                Ae(t, [{
                    key: "buildRows",
                    value: function e(t, a) {
                        var r = this.props,
                            n = r.communication,
                            o = r.intl,
                            s = r.config,
                            l = r.getUpdatedTopics,
                            c = r.guest,
                            u = r.league,
                            d = r.league,
                            p = d.members,
                            f = d.settings,
                            m = d.teams,
                            g = d.usesFAAB,
                            v = r.playerPool,
                            y = r.showActionColumn,
                            _ = r.useTeamId,
                            b = r.url;
                        var h = t || n && n.filter(function (e) {
                            return je()(e, "lastUpdateInfo.source") !== Be
                        });
                        var T = false !== _ ? parseInt(this.props.teamId, 10) : -1;
                        var w = [];
                        h && Object(xe["toJS"])(h).forEach(function (e) {
                            var t = e.date,
                                r = e.dateEdited,
                                n = e.messages,
                                d = e.type;
                            t = t || r;
                            d = a || d;
                            "NOTE" !== d && "MSG_BOARD" !== d || (t = r);
                            "MSG_BOARD" === d && n && n.length > 0 && (e.messages = e.messages[0]);
                            var _ = i.a.createElement(be["a"], {
                                date: t,
                                intl: o
                            });
                            var h = i.a.createElement(he["a"], {
                                config: s,
                                guest: c,
                                intl: o,
                                league: u,
                                members: p,
                                message: e,
                                teamId: T,
                                type: d
                            });
                            var M = i.a.createElement(Te["a"], {
                                config: s,
                                intl: o,
                                isLeagueUsingFAAB: g,
                                league: u,
                                members: p,
                                message: e,
                                playerPool: v,
                                settings: f,
                                showPlayerCard: true,
                                teams: m,
                                teamId: T,
                                type: d
                            });
                            var E = [_, h, M];
                            if (y) {
                                var O = i.a.createElement(we["a"], {
                                    config: s,
                                    guest: c,
                                    league: u,
                                    intl: o,
                                    message: e,
                                    type: d,
                                    url: b,
                                    getUpdatedTopics: l
                                });
                                E.push(O)
                            }
                            w.push(E)
                        });
                        return w
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.activityType,
                            r = t.count,
                            o = t.endDate,
                            s = t.league,
                            l = t.NUM_PER_PAGE,
                            p = t.onChange,
                            f = t.onClick_PaginationItem,
                            m = t.showActionColumn,
                            g = t.showFilter,
                            v = t.startDate,
                            y = t.teamId,
                            _ = t.transactionType,
                            b = t.intl;
                        var h = i.a.createElement(d["b"], Ve.date);
                        var T = i.a.createElement(d["b"], Ve.type);
                        var w = i.a.createElement(d["b"], Ve.detail);
                        var M = i.a.createElement(d["b"], Ve.action);
                        var E = [h, T, w];
                        m && E.push(M);
                        var O = this.buildRows();
                        var I = r > l;
                        var S = Math.ceil(r / l);
                        var j = this.props.pageNum;
                        j = parseInt(j, 10);
                        var x = null;
                        O && O.length && (x = Ie()(O.map(function (e, t) {
                            if (!m && t > Fe) return false;
                            return i.a.createElement(c["g"], {
                                key: t
                            }, e.map(function (e, a) {
                                return i.a.createElement(u["a"], {
                                    key: "".concat(t, "-").concat(a),
                                    isHeader: false
                                }, e)
                            }))
                        })));
                        return i.a.createElement("div", {
                            className: "jsx-3422097442 league--recent--activity--table"
                        }, i.a.createElement(n.a, {
                            styleId: "3422097442",
                            css: [".league--recent--activity--table.jsx-3422097442 .Table2__table__wrapper{border-bottom:1px solid #f1f2f3;margin-bottom:20px;margin-top:20px;width:100%;}", ".league--recent--activity--table.jsx-3422097442 .Table2__tbody,.league--recent--activity--table.jsx-3422097442 .Table2__td + .Table2__td,.league--recent--activity--table.jsx-3422097442 .Table2__th + .Table2__th{border:1px solid #DCDDDF;border-bottom-color:#f1f2f3;}", ".league--recent--activity--table.jsx-3422097442 .Table2__tbody{border-width:0 0 0 0;}", ".league--recent--activity--table.jsx-3422097442 .Table2__th{border-width:1px 0 1px 0;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td{border-width:0 0 1px 0;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td + .Table2__td{border-width:0 0 1px 1px;}", ".league--recent--activity--table.jsx-3422097442 .Table2__th + .Table2__th{border-width:1px 0 0 1px;}", ".league--recent--activity--table.jsx-3422097442 .Table2__tbody > tr.Table2__tr:last-child > .table2__td{border:0 0 0 1px;}", ".league--recent--activity--table.jsx-3422097442 .Table2__th{color:#151617;font-size:11px;height:22px;padding-left:11px;width:25%;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td{color:#6C6D6F;font-size:12px;height:28px;line-height:14px;padding:7px 0 7px 11px;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td .typeCell{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td .typeCell .typeInfo{margin-left:8px;white-space:pre-line;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td .typeCell .typeInfo > span:first-of-type{color:#797B7E;font-size:12px;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td .typeCell .typeInfo > span{color:#797979;display:block;font-size:11px;}", ".league--recent--activity--table.jsx-3422097442 .filterDropdowns{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}", ".league--recent--activity--table.jsx-3422097442 .filterDropdowns .Dropdown__Wrapper{margin-right:15px;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td .actionCell a{margin-right:5px;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td .actionCell a::after{background-color:#dcdddf;content:'';display:inline-block;height:10px;margin-left:5px;width:1px;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td .actionCell a:last-of-type:after{width:0;}", ".league--recent--activity--table.jsx-3422097442 .Table2__td .transactionCell > span{display:block;}", ".league--recent--activity--table.jsx-3422097442 .no-activity-msg.jsx-3422097442{font-size:15px;}", ".league--recent--activity--table .typeCell.type-ugc .typeInfo{display:block;width:80%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}", ".league--recent--activity--table .recentActivityDetail.detail-ugc p{display:block;width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;height:14px;}", ".league--recent--activity--table .typeCell .typeCellIcon{width:20px;height:20px;}"]
                        }), g && i.a.createElement(_e, {
                            league: s,
                            activityType: a,
                            teamId: y,
                            onChange: p,
                            startDate: v,
                            endDate: o,
                            transactionType: _
                        }), i.a.createElement(c["d"], Pe({
                            headings: E,
                            rows: x
                        }, {
                            oddStripes: true
                        })), O.length > 0 ? null : i.a.createElement("div", {
                            className: "jsx-3422097442 tc pa5 no-activity-msg fw-bold"
                        }, b.formatMessage(Ve.noActivityLabel)), I ? i.a.createElement(Ee.a, {
                            className: "recentActivity_pagination",
                            onClickItem: f,
                            navItemsShown: Ye,
                            activeNavItem: j,
                            navItemsTotal: S
                        }) : null)
                    }
                }]);
                return t
            }(i.a.Component);
            Ue.defaultProps = {
                showFilter: true,
                showActionColumn: true
            }
        },
        820: function (e, t, a) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            var r = a(14);
            var n = a.n(r);
            var o = a(5);
            var i = a.n(o);
            var s = a(0);
            var l = a.n(s);
            var c = a(46);
            var u = a(29);
            var d = a(63);
            var p = a(100);
            var f = a(2);
            var m = a(7);
            var g = a(3);
            var v = a(13);
            var y = a(574);
            var _ = a(15);
            var b = a.n(_);
            var h = a(40);
            var T = a(58);
            var w = a(10);
            var M = a.n(w);
            var E = a(65);
            var O = a(265);
            var I = a(128);
            var S = a(341);
            var j = a.n(S);
            var x = a(573);
            var C = a(359);
            var P = a(136);
            var D = a(190);

            function k(e) {
                k = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function e(t) {
                    return typeof t
                } : function e(t) {
                    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                };
                return k(e)
            }

            function A(e, t) {
                return R(e) || L(e, t) || N()
            }

            function N() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }

            function L(e, t) {
                var a = [];
                var r = true;
                var n = false;
                var o = void 0;
                try {
                    for (var i = e[Symbol.iterator](), s; !(r = (s = i.next()).done); r = true) {
                        a.push(s.value);
                        if (t && a.length === t) break
                    }
                } catch (e) {
                    n = true;
                    o = e
                } finally {
                    try {
                        r || null == i["return"] || i["return"]()
                    } finally {
                        if (n) throw o
                    }
                }
                return a
            }

            function R(e) {
                if (Array.isArray(e)) return e
            }

            function V(e) {
                return function () {
                    var t = this,
                        a = arguments;
                    return new Promise(function (r, n) {
                        var o = e.apply(t, a);

                        function i(e, t) {
                            try {
                                var a = o[e](t);
                                var i = a.value
                            } catch (e) {
                                n(e);
                                return
                            }
                            a.done ? r(i) : Promise.resolve(i).then(s, l)
                        }

                        function s(e) {
                            i("next", e)
                        }

                        function l(e) {
                            i("throw", e)
                        }
                        s()
                    })
                }
            }

            function F(e) {
                return U(e) || B(e) || Y()
            }

            function Y() {
                throw new TypeError("Invalid attempt to spread non-iterable instance")
            }

            function B(e) {
                if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
            }

            function U(e) {
                if (Array.isArray(e)) {
                    for (var t = 0, a = new Array(e.length); t < e.length; t++) a[t] = e[t];
                    return a
                }
            }

            function q(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function H(e, t) {
                if (t && ("object" === k(t) || "function" === typeof t)) return t;
                return J(e)
            }

            function z(e, t) {
                for (var a = 0; a < t.length; a++) {
                    var r = t[a];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    "value" in r && (r.writable = true);
                    Object.defineProperty(e, r.key, r)
                }
            }

            function W(e, t, a) {
                t && z(e.prototype, t);
                a && z(e, a);
                return e
            }

            function G(e, t) {
                if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function J(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            var X = {
                ACTIVITY_SETTINGS: 0,
                ACTIVITY_TRANSACTIONS: 2,
                MSG_BOARD: 3,
                NOTE: 1,
                POLL: 4
            };
            var K = {
                allButMove: -2,
                all: -1,
                added: 2,
                dropped: 3,
                moved: 1,
                traded: 4
            };
            var $ = "kona_league_communication";
            var Q = Object(f["h"])({
                header: {
                    id: "page_recent_activity_pageHeader",
                    defaultMessage: "Recent Activity"
                }
            });
            var Z = 25;
            var ee = -1;
            var te = -1;
            var ae = -2;
            var re = 8;
            var ne = 25;
            var oe = 2;
            var ie = 1;
            var se = function (e) {
                G(t, e);
                W(t, null, [{
                    key: "getInitialProps",
                    value: function e(t) {
                        var a = t.config;
                        return {
                            page: {
                                config: a
                            }
                        }
                    }
                }]);

                function t(e) {
                    var a;
                    q(this, t);
                    a = H(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    a.store = Object(m["observable"])({
                        savingChanges: false
                    });
                    a.onChange = a.onChange.bind(J(a));
                    a.onClick_PaginationItem = a.onClick_PaginationItem.bind(J(a));
                    a.generateFilter = a.generateFilter.bind(J(a));
                    return a
                }
                W(t, [{
                    key: "componentDidMount",
                    value: function e() {
                        var t = this;
                        var a = this.props,
                            r = a.config,
                            n = a.guest,
                            o = a.intl,
                            i = a.page,
                            s = a.url;
                        this.disposers = Object(D["a"])({
                            config: r,
                            guest: n,
                            intl: o,
                            onReaction: function e(a) {
                                var r = a.leagueId,
                                    l = a.seasonConfig,
                                    c = a.seasonId;
                                t.getProps({
                                    config: l,
                                    guest: n,
                                    intl: o,
                                    leagueId: r,
                                    page: i,
                                    query: s.query,
                                    seasonId: c
                                })
                            },
                            page: i,
                            url: s
                        })
                    }
                }, {
                    key: "generateFilter",
                    value: function e() {
                        var t = this.props,
                            a = t.page,
                            r = t.url.query;
                        var n = Object(m["toJS"])(a.get("config"));
                        var o = n.constants.communication.communicationTypes;
                        var i = o.transactionFreeAgentAdd,
                            s = o.transactionFreeAgentDrop,
                            l = o.transactionRoster,
                            c = o.transactionRosterDrop,
                            u = o.transactionWaiverAdd,
                            d = o.transactionWaiverDrop;
                        var p = void 0 !== a.get("activityType") ? Number(a.get("activityType")) : Number(r.activityType) || -1;
                        var f = a.get("pageNum") || Number(r.page) || 1;
                        var g = a.get("transactionType") || Number(r.transactionType) || ae;
                        var v = a.get("startDate") || Number(r.startDate) || b()((new Date).setDate((new Date).getDate() - re)).format("YYYYMMDD");
                        var y = a.get("endDate") || Number(r.endDate) || b()(new Date).format("YYYYMMDD");
                        var _ = a.get("teamId") || Number(r.teamId) || -1;
                        var h = f && f > 0 ? Math.round((f - 1) * Z) : 0;
                        var T = [];
                        var w = [];
                        var M = [];
                        var E = true;
                        var O = j()(X, function (e) {
                            return e === p
                        });
                        O && p !== ee ? T.push(O) : Object.keys(X).forEach(function (e) {
                            T.push(e)
                        });
                        if (T.includes("ACTIVITY_SETTINGS")) {
                            T.push("ACTIVITY_STATUS");
                            T.push("ACTIVITY_SCHEDULE")
                        }
                        var I = {
                            topics: {
                                filterType: {
                                    value: T
                                },
                                limit: ne,
                                limitPerMessageSet: {
                                    value: ne
                                },
                                offset: h,
                                sortMessageDate: {
                                    sortPriority: ie,
                                    sortAsc: false
                                },
                                sortFor: {
                                    sortPriority: oe,
                                    sortAsc: false
                                },
                                filterDateRange: v && y ? {
                                    value: b()(v, "YYYYMMDD").startOf("day").valueOf(),
                                    additionalValue: b()(y, "YYYYMMDD").endOf("day").valueOf()
                                } : null
                            }
                        };
                        _ && _ > 0 && (I.topics.filterMessageToAndFromIds = {
                            value: [_]
                        });
                        g === K.moved ? w.push(l) : g === K.added ? w.push(i, u) : g === K.dropped ? w.push(s, c, d) : g === K.traded ? w.push.apply(w, F(Object(C["a"])(o))) : g === K.all && (E = false);
                        w.length > 0 ? I.topics.filterIncludeMessageTypeIds = {
                            value: w
                        } : M.push.apply(M, F(Object(x["a"])(o, E)));
                        M.length > 0 && (I.topics.filterExcludeMessageTypeIds = {
                            value: M
                        });
                        return I
                    }
                }, {
                    key: "getRequest",
                    value: function () {
                        var e = V(n.a.mark(function e(t) {
                            var a = this;
                            var r, o, i, s, l, c, d;
                            return n.a.wrap(function e(n) {
                                while (1) switch (n.prev = n.next) {
                                    case 0:
                                        r = t.config, o = t.intl, i = t.leagueId, s = t.seasonId;
                                        l = this.generateFilter();
                                        n.next = 4;
                                        return Object(E["g"])(Object(v["l"])(r, i, s, l, $), {
                                            message: o.formatMessage(O["messages"].noCommunicationGroup)
                                        });
                                    case 4:
                                        c = n.sent;
                                        c && c.communication && !c.communication.topics && Object(u["b"])({
                                            error: true,
                                            message: o.formatMessage(O["messages"].noCommunicationGroup)
                                        });
                                        d = c.communication;
                                        Object(m["runInAction"])(function () {
                                            a.props.page.merge({
                                                communication: d
                                            })
                                        });
                                        return n.abrupt("return", c);
                                    case 9:
                                    case "end":
                                        return n.stop()
                                }
                            }, e, this)
                        }));
                        return function t(a) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "getProps",
                    value: function () {
                        var e = V(n.a.mark(function e(t) {
                            var a = this;
                            var r, o, i, s, l, c, u;
                            return n.a.wrap(function e(p) {
                                while (1) switch (p.prev = p.next) {
                                    case 0:
                                        r = t.config, o = t.guest, i = t.intl, s = t.leagueId, l = t.page, c = t.seasonId, u = t.query;
                                        Object(E["f"])({
                                            action: function () {
                                                var e = V(n.a.mark(function e(t) {
                                                    var o, d, p, f, g, v, y, _, h, T, w, M, E, S;
                                                    return n.a.wrap(function e(n) {
                                                        while (1) switch (n.prev = n.next) {
                                                            case 0:
                                                                o = t.errors, d = o.customMessage, p = o.isError, f = t.league, g = t.playerPool;
                                                                v = u.page ? parseInt(u.page, 10) : 1;
                                                                y = l.get("activityType") || u.activityType || ee;
                                                                _ = l.get("transactionType") || Number(u.transactionType) || ae;
                                                                h = l.get("startDate") || Number(u.startDate) || b()((new Date).setDate((new Date).getDate() - re)).format("YYYYMMDD");
                                                                T = l.get("endDate") || Number(u.endDate) || b()(new Date).format("YYYYMMDD");
                                                                w = l.get(w) || Number(u.teamId) || te;
                                                                M = null;
                                                                E = null;
                                                                if (p) {
                                                                    n.next = 23;
                                                                    break
                                                                }
                                                                if (!(f.seasonId !== r.currentSeason)) {
                                                                    n.next = 15;
                                                                    break
                                                                }
                                                                d = i.formatMessage(O["messages"].requestedNonCurrentSeason);
                                                                p = true;
                                                                n.next = 23;
                                                                break;
                                                            case 15:
                                                                n.next = 17;
                                                                return a.getRequest({
                                                                    config: r,
                                                                    intl: i,
                                                                    leagueId: s,
                                                                    seasonId: c
                                                                });
                                                            case 17:
                                                                n.t0 = n.sent;
                                                                if (n.t0) {
                                                                    n.next = 20;
                                                                    break
                                                                }
                                                                n.t0 = {};
                                                            case 20:
                                                                S = n.t0;
                                                                M = S.communication;
                                                                E = S.count;
                                                            case 23:
                                                                Object(m["runInAction"])(function () {
                                                                    l.merge({
                                                                        activityType: y,
                                                                        config: r,
                                                                        communication: M,
                                                                        count: E,
                                                                        endDate: T,
                                                                        errors: {
                                                                            customMessage: d,
                                                                            isError: p
                                                                        },
                                                                        league: f,
                                                                        pageNum: v,
                                                                        playerPool: g,
                                                                        playerTransactionStore: Object(I["a"])(),
                                                                        seasonId: c,
                                                                        startDate: h,
                                                                        teamId: w,
                                                                        transactionType: _
                                                                    })
                                                                });
                                                            case 24:
                                                            case "end":
                                                                return n.stop()
                                                        }
                                                    }, e, this)
                                                }));
                                                return function t(a) {
                                                    return e.apply(this, arguments)
                                                }
                                            }(),
                                            guest: o,
                                            intl: i,
                                            pageName: d["_7"],
                                            params: {
                                                leagueId: s
                                            },
                                            request: function () {
                                                var e = V(n.a.mark(function e() {
                                                    var t, a, l, u;
                                                    return n.a.wrap(function e(n) {
                                                        while (1) switch (n.prev = n.next) {
                                                            case 0:
                                                                n.next = 2;
                                                                return Promise.all([Object(v["r"])({
                                                                    config: r,
                                                                    guest: o,
                                                                    leagueId: s,
                                                                    returnResponse: true,
                                                                    seasonId: c,
                                                                    validate: true,
                                                                    view: ["mPendingTransactions", "mSettings", "mStatus", "mMatchupScore", "mTeam"]
                                                                }), Object(E["g"])(Object(v["s"])({
                                                                    config: r,
                                                                    seasonId: c
                                                                }), {
                                                                    intl: i
                                                                })]);
                                                            case 2:
                                                                t = n.sent;
                                                                a = A(t, 2);
                                                                l = a[0];
                                                                u = a[1];
                                                                return n.abrupt("return", {
                                                                    league: l,
                                                                    playerPool: u
                                                                });
                                                            case 7:
                                                            case "end":
                                                                return n.stop()
                                                        }
                                                    }, e, this)
                                                }));
                                                return function t() {
                                                    return e.apply(this, arguments)
                                                }
                                            }()
                                        });
                                    case 2:
                                    case "end":
                                        return p.stop()
                                }
                            }, e, this)
                        }));
                        return function t(a) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "componentWillUnmount",
                    value: function e() {
                        this.disposers.forEach(function (e) {
                            return e()
                        })
                    }
                }, {
                    key: "buildURL",
                    value: function e() {
                        var t = this.props,
                            a = t.page,
                            r = t.url;
                        var n = Object(m["toJS"])(a.get("config"));
                        var o = r.pathname,
                            i = r.query;
                        var s = r.query.seasonId || n.currentSeason;
                        var l = a.get("activityType");
                        var c = a.get("endDate");
                        var u = a.get("pageNum");
                        var d = a.get("startDate");
                        var p = a.get("teamId");
                        var f = a.get("transactionType");
                        return Object(T["a"])({
                            pathname: o,
                            query: Object(w["mix"])({}, [i, {
                                endDate: c,
                                page: u,
                                seasonId: s,
                                startDate: d,
                                teamId: p,
                                transactionType: f,
                                activityType: l
                            }])
                        })
                    }
                }, {
                    key: "onChange",
                    value: function () {
                        var e = V(n.a.mark(function e(t) {
                            var a = this;
                            var r, o, i, s, l, c, u, d, p, f, g;
                            return n.a.wrap(function e(n) {
                                while (1) switch (n.prev = n.next) {
                                    case 0:
                                        t = t || {};
                                        r = t, o = r.updateType, i = r.updateValue;
                                        s = this.props, l = s.intl, c = s.page, u = s.url.query.leagueId;
                                        d = Object(m["toJS"])(c.get("config"));
                                        p = c.get("seasonId");
                                        f = null;
                                        Object(m["runInAction"])(function () {
                                            a.store.savingChanges = true;
                                            c.set(o, i);
                                            "activityType" === o && c.merge({
                                                teamId: te,
                                                transactionType: ae
                                            })
                                        });
                                        g = this.buildURL();
                                        n.prev = 8;
                                        n.next = 11;
                                        return this.getRequest({
                                            config: d,
                                            intl: l,
                                            leagueId: u,
                                            seasonId: p
                                        });
                                    case 11:
                                        n.t0 = n.sent;
                                        if (n.t0) {
                                            n.next = 14;
                                            break
                                        }
                                        n.t0 = {};
                                    case 14:
                                        f = n.t0;
                                        n.next = 20;
                                        break;
                                    case 17:
                                        n.prev = 17;
                                        n.t1 = n["catch"](8);
                                        console.error(n.t1);
                                    case 20:
                                        n.prev = 20;
                                        Object(m["runInAction"])(function () {
                                            a.store.savingChanges = false
                                        });
                                        return n.finish(20);
                                    case 23:
                                        Object(m["runInAction"])(function () {
                                            c.merge({
                                                communication: f.communication,
                                                count: f.count
                                            })
                                        });
                                        h["a"].replace(g, g, {
                                            shallow: true
                                        });
                                    case 25:
                                    case "end":
                                        return n.stop()
                                }
                            }, e, this, [
                                [8, 17, 20, 23]
                            ])
                        }));
                        return function t(a) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "onClick_PaginationItem",
                    value: function () {
                        var e = V(n.a.mark(function e(t, a) {
                            return n.a.wrap(function e(t) {
                                while (1) switch (t.prev = t.next) {
                                    case 0:
                                        window.scrollTo(0, 0);
                                        this.onChange({
                                            updateType: "pageNum",
                                            updateValue: a
                                        });
                                    case 2:
                                    case "end":
                                        return t.stop()
                                }
                            }, e, this)
                        }));
                        return function t(a, r) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props,
                            a = t.intl,
                            r = t.page,
                            n = t.guest,
                            o = t.url;
                        var s = Object(m["toJS"])(r.get("config"));
                        var c = r.get("league");
                        var f = Object(m["toJS"])(r.get("communication"));
                        var g = null;
                        var v = l.a.createElement(P["a"], {
                            height: "300px"
                        });
                        if (c && f) {
                            g = c.settings.name;
                            v = l.a.createElement(y["a"], {
                                activityType: parseInt(r.get("activityType"), 10),
                                communication: f.topics,
                                config: s,
                                count: r.get("count"),
                                endDate: r.get("endDate"),
                                guest: n,
                                intl: a,
                                league: c,
                                leagueId: c.id,
                                NUM_PER_PAGE: Z,
                                onChange: this.onChange,
                                onClick_PaginationItem: this.onClick_PaginationItem,
                                pageNum: r.get("pageNum"),
                                playerPool: r.get("playerPool"),
                                startDate: r.get("startDate"),
                                teamId: r.get("teamId"),
                                transactionType: parseInt(r.get("transactionType"), 10),
                                url: o,
                                getUpdatedTopics: this.getRequest.bind(this, {
                                    config: s,
                                    intl: a,
                                    leagueId: c.id,
                                    seasonId: c.seasonId
                                })
                            })
                        }
                        return l.a.createElement(u["d"], {
                            intl: a,
                            pageName: d["_7"],
                            param: {
                                supportsMobile: false
                            }
                        }, l.a.createElement(p["a"], {
                            className: "recent--activity--page",
                            header: a.formatMessage(Q.header, {
                                leagueName: g
                            }),
                            game: s.abbreviation,
                            gameBorder: true,
                            subHeader: g
                        }, l.a.createElement(i.a, {
                            styleId: "3320018949",
                            css: [".league--recent--activity--table{background:white;margin-bottom:12px;font-size:12px;}", ".league--recent--activity--table .Table2__table__wrapper{margin-top:0;margin-bottom:0;}", ".league--recent--activity--table .Table2__table{table-layout:fixed;}", ".league--recent--activity--table .Table2__table .Table2__tr > th:nth-child(1){width:8%;}", ".league--recent--activity--table .Table2__table .Table2__tr > th:nth-child(2){width:25%;}", ".league--recent--activity--table .Table2__table .Table2__tr > th:nth-child(3){width:45%;}", ".league--recent--activity--table .Table2__table .Table2__tr > th:nth-child(4){width:22%;}", ".league--recent--activity--table .noActivity{border-bottom:1px solid #edeef0;font-size:14px;font-weight:500;padding:10px 0;text-align:center;}", ".league--recent--activity--table .recentActivityDetail{white-space:normal;}", ".overlap-loader{top:130px !important;height:calc(100% - 130px) !important;}"]
                        }), this.store.savingChanges && l.a.createElement(P["a"], {
                            overlap: true
                        }), v))
                    }
                }]);
                return t
            }(l.a.Component);
            t["default"] = Object(c["c"])(Object(g["observer"])(se))
        },
        92: function (e, t, a) {
            e.exports = a(222)
        },
        97: function (e, t, a) {
            e.exports = a(138)
        }
    }, [2509]);
    return {
        page: e.default
    }
});