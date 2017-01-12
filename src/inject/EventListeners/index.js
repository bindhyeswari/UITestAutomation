import CSSUtils from '../css_path';

export function focusout(cb) {
    document.addEventListener('focusout', (e) => {
        cb({
            event: 'input',
            data: {
                selector: CSSUtils.cssPath(e.target),
                type: 'focusout',
                value: e.target.value
            }
        });
    })
}

export function keypress(cb) {
    document.addEventListener('keypress', (e) => {
        cb({
            event: 'input',
            data: {
                selector: CSSUtils.cssPath(e.target),
                type: 'keypress',
                char: String.fromCharCode(e.charCode),
                value: e.target.value
            }
        });
    })
}
