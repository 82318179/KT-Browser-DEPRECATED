(function($) {
    $.fn.menu = function(params) {
        var settings = $.extend({
                tab: null
            }, params),
            t = this

        t.toggled = false
        $(t).css({
            opacity: 0,
            display: 'none'
        })
        t.menuItems = $('<ul class="menu-items" style="z-index: 9999;background-color: #fff;">').appendTo($(t))
        t.newWindow = $('<li class="menu-item ripple">').appendTo(t.menuItems)
        t.private = $('<li class="menu-item ripple">').appendTo(t.menuItems)
        if(process.platform == 'win32') {
            t.fullscreen = $('<li class="menu-item ripple">').appendTo(t.menuItems)
            t.fullscreen.append('<i class="material-icons">fullscreen</i>')
            t.fullscreen.append('<p class="menu-text">Fullscreen</p>')
        }
        t.history = $('<li class="menu-item ripple">').appendTo(t.menuItems)
        t.bookmarks = $('<li class="menu-item ripple">').appendTo(t.menuItems)
        t.downloads = $('<li class="menu-item ripple">').appendTo(t.menuItems)
        t.settings = $('<li class="menu-item ripple">').appendTo(t.menuItems)
        t.nightmode = $('<li class="menu-item ripple">').appendTo(t.menuItems)
        t.devTools = $('<li class="menu-item ripple">').appendTo(t.menuItems)
        t.info = $('<li class="menu-item ripple">').appendTo(t.menuItems)

        t.settings.append('<i class="material-icons">settings</i>')
        t.settings.append('<p class="menu-text">Settings</p>')

        t.history.append('<i class="material-icons">history</i>')
        t.history.append('<p class="menu-text">History</p>')

        t.bookmarks.append('<i class="material-icons">collections_bookmark</i>')
        t.bookmarks.append('<p class="menu-text">Bookmarks</p>')

        t.downloads.append('<i class="material-icons">file_download</i>')
        t.downloads.append('<p class="menu-text">Downloads</p>')

        t.newWindow.append('<i class="material-icons">desktop_windows</i>')
        t.newWindow.append('<p class="menu-text">New window</p>')

        t.devTools.append('<i class="material-icons">code</i>')
        t.devTools.append('<p class="menu-text">Developer Tools</p>')

        t.nightmode.append('<i class="material-icons">brightness_4</i>')

        if(getNightMode()) {
            t.nightmode.append('<p class="menu-text">Exit night mode</p>')
        } else {
            t.nightmode.append('<p class="menu-text">Night mode</p>')
        }

        t.info.append('<i class="material-icons">info</i>')
        t.info.append('<p class="menu-text">About KT Browser</p>')

        $(t).find('.menu-item').mousedown(function(e) {
            makeRippleMenuItem(this, e);
        })

        $(window).on('click', function() {
            t.hide()
        })
        t.history.click(function(e) {
            var tab = new Tab(),
                instance = $('#instances').browser({
                    tab: tab,
                    url: 'kt-browser://history'
                })
            addTab(instance, tab);
        });

        t.newWindow.click(function(e) {
            const BrowserWindow = remote.BrowserWindow;

            var mainWindow = new BrowserWindow({
                frame: false
            })
            mainWindow.loadURL(`file://${__dirname}/index.html`)

        });
        t.private.click(function(e) {
            if (settings.tab.instance.webview.isPrivacy)
            {
                Toast_Material({
                    content: "Incognito mode is now off for this tab",
                    updown: "bottom",
                    position: "center",
                    align: "center"
                });
                settings.tab.instance.webview.isPrivacy = false;
            } else {
                Toast_Material({
                    content: "Incognito mode is now on for this tab, your browsing trace will be wiped when this tab is closed",
                    updown: "bottom",
                    position: "center",
                    align: "center"
                });
                settings.tab.instance.webview.isPrivacy = true;
            }
            settings.tab.instance.webview.updateURLBarIcon()
        });
        t.fullscreen.click(function(e) {
            settings.tab.instance.webview.webview.executeJavaScript('isfullscreen()', true, function(result) {
                if(result == true) {
                    settings.tab.instance.webview.webview.executeJavaScript('setfullscreen(false)', false);
                } else {
                    settings.tab.instance.webview.webview.executeJavaScript('setfullscreen(true)', false);
                }
            })
        });

        t.nightmode.click(function(e) {
            settings.tab.instance.webview.webview.executeJavaScript('isNightMode()', true, function(result) {
                if(result == true) {
                    settings.tab.instance.webview.webview.executeJavaScript('setNightMode(false)', false);
                    settings.tab.instance.webview.webview.reload();
                } else {
                    settings.tab.instance.webview.webview.executeJavaScript('setNightMode(true)', false);
                    settings.tab.instance.webview.webview.executeJavaScript('NightMode()', false);
                }
            })
        });

        t.info.click(function(e) {
            const BrowserWindow = remote.BrowserWindow;

            var mainWindow = new BrowserWindow({
                title: 'KT Browser',
                frame: false
            })
            mainWindow.loadURL(`file://${__dirname}/about.html`)
        });
        t.bookmarks.click(function(e) {
            Toast_Material({
                content: "Not yet complete!",
                updown: "bottom",
                position: "center",
                align: "center"
            });
        });
        t.downloads.click(function(e) {
            const BrowserWindow = remote.BrowserWindow;

            var mainWindow = new BrowserWindow({
                title: 'Downloads',
                frame: false
            })
            mainWindow.loadURL(`file://${__dirname}/downloads.html`)

        });
        t.settings.click(function(e) {
            const BrowserWindow = remote.BrowserWindow;

            var mainWindow = new BrowserWindow({
                title: 'Settings',
                frame: false,
                width: 600,
                height: 750,
                show: false
            })

            mainWindow.once('ready-to-show', () => {
                mainWindow.show()
            })

            mainWindow.on('closed', () => {
                mainWindow = null
            })

            mainWindow.loadURL(`file://${__dirname}/settings.html`)
        });
        t.devTools.click(function(e) {
            settings.tab.instance.webview.webview.openDevTools({
                mode: 'right'
            });
        });


        t.show = function() {
            if(getNightMode()) {
                t.nightmode.html('')
                t.nightmode.append('<i class="material-icons">wb_sunny</i>')
                t.nightmode.append('<p class="menu-text">Exit night mode</p>')

                $(".menu-item").css("background-color", "#212121");
                $('.menu-item').hover(function() {
                    $(this).css("background-color", "#424242");
                }, function() {
                    $(this).css("background-color", "#212121");
                });
                $(".menu-text").css("color", "#fff");
                $(".menu-item>i").css("color", "#fff");
                $(".ripple").attr("data-ripple-color", "#616161");     
            } else {
                t.nightmode.html('')
                t.nightmode.append('<i class="material-icons">brightness_4</i>')
                t.nightmode.append('<p class="menu-text">Night mode</p>')

                $(".menu-item").css("background-color", "#fff");
                $('.menu-item').hover(function() {
                    $(this).css("background-color", "#E0E0E0");
                }, function() {
                    $(this).css("background-color", "#fff");
                });
                $(".menu-text").css("color", "");
                $(".menu-item>i").css("color", "");
                $(".ripple").attr("data-ripple-color", "#444");     
            }
            t.private.html('')
            t.private.append('<i class="material-icons">vpn_lock</i>')
            if(!settings.tab.instance.webview.isPrivacy) {
                t.private.append('<p class="menu-text">Private mode</p>')
            } else {
                t.private.append('<p class="menu-text">Exit private mode</p>')
            }
            //menu fade in animation
            $(t).css('display', 'block');
            $(t).css('opacity', 0).animate({
                opacity: 1
            }, 200, function() {
                t.toggled = true
            }).css('top', -20).animate({
                top: 8
            }, {
                queue: false,
                duration: 100
            });
        }

        t.hide = function() {
            $(t).css('opacity', 1).animate({
                opacity: 0
            }, 60).css('top', 8).animate({
                top: -20
            }, {
                queue: false,
                complete: function() {
                    $(t).css('display', 'none');
                },
                duration: 100
            });
            t.toggled = false;
        }

        return this
    }

}(jQuery))