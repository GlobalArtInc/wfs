const title = 'WarFace Stats'

export default function getPageTitle(pageMeta) {
    if (pageMeta.hideTitle === true) {
        return pageMeta.title
    } else {
        if (pageMeta.title) {
            return `${pageMeta.title} - ${title}`
        } else return title
    }
}

