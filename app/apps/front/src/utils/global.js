export function number(item) {
    return item ? Number(item) : 0
}

export function getLanguage(language) {
    switch (language) {
        case 'en':
            return 'us'
        case 'ja':
            return 'jp'
        case 'uk':
            return 'ua'
        default:
            return language;
    }
}