const Store = require('electron-store')

class SystemSettingStore extends Store {
    constructor (settings, number) {
        super(settings);

        this.darkTheme = this.get('darkTheme');
        this.alwaysOnTop = this.get('alwaysOnTop');
        this.limitMinimumTime
    }

    getDarkTheme () {
        this.darkTheme = this.get('darkTheme');
        return this
    }

    getAlwaysOnTop () {
        this.alwaysOnTop = this.get('alwaysOnTop');
        return this;
    }

    setDarkTheme (theme) {
        this.darkTheme = theme
        this.set('darkTheme', this.darkTheme)
        return this;
    }

    setAlwaysOnTop (bool) {
        this.alwaysOnTop = bool
        this.set('alwaysOnTop', this.alwaysOnTop);
        return this;
    }
}

modules.exports = SystemSettingStore