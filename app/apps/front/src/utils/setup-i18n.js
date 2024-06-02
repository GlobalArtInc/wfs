import VueI18n from 'vue-i18n';
import Vue from 'vue';

Vue.use(VueI18n);

// eslint-disable-next-line no-unused-vars
const getMessages = (file) => {
    console.log(file)
    return file.replace('---', '');
}


const messages = {
    en: require('@/locales/en/locales.json'),
    ru: require('@/locales/ru/locales.json'),
    se: require('@/locales/se/locales.json'),
    uk: require('@/locales/uk/locales.json'),
    de: require('@/locales/de/locales.json')
}

const i18n = new VueI18n({
    locale: 'en',
    messages
})

Object.defineProperty(Vue.prototype, '$locale', {
    get: function () {
        return i18n.locale
    },
    set: function (locale) {
        i18n.locale = locale
    }
})

export default i18n
