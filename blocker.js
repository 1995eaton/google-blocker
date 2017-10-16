const blacklist = [
    /w3schools?\.com/,
];

const watching = [];

function filterResult(item) {
    if (item.nodeType !== Node.ELEMENT_NODE)
        return false;
    if (!item.matches('.g') || watching.includes(item))
        return false;

    const url = item.querySelector('h3.r > a[href]');
    if (!url)
        return false;
    const host = new URL(url).host;

    const blacklisted = blacklist.some(pattern => {
        return typeof blacklist === 'string' ?
            host.includes(pattern) : pattern.test(host);
    });
    if (!blacklisted)
        return false;

    item.style.opacity = '0.35';
    item.style.transition = 'opacity 0.5s';

    item.addEventListener('mouseover', () => {
        item.style.opacity = '1';
    });
    item.addEventListener('mouseout', () => {
        item.style.opacity = '0.35';
    });

    watching.push(item);

    return true;
}

function filterAllResults() {
    const searches = Array.from(document.querySelectorAll('.g'));
    return searches.reduce((count, item) => count + filterResult(item), 0);
}

function addObserver() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mut => {
            if (mut.type !== 'childList')
                return;
            if (mut.target.nodeType !== Node.ELEMENT_NODE)
                return;

            Array.from(mut.addedNodes).forEach(node => filterResult(node));
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

document.addEventListener('readystatechange', () => {
    if (!/google\.[a-z]+$/.test(new URL(document.URL).host))
        return;

    if (document.readyState === 'interactive')
        addObserver();
});

document.addEventListener('DOMContentLoaded', () => {
    if (/google\.[a-z]+$/.test(new URL(document.URL).host))
        filterAllResults();
});
