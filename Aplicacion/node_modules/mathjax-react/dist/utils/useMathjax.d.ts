import { SourceSpecification } from "./convert";
export interface UseMathJaxProps extends SourceSpecification {
    display: boolean;
    settings: any;
}
export interface UseMathJaxReturn {
    error: string | null;
    renderedHTML: string | null;
    getProps: () => {
        ref: (node: HTMLElement | null) => void;
        dangerouslySetInnerHTML: {
            __html: string;
        } | undefined;
    };
}
/**
 * A low-level hook to use MathJax in your application.
 *
 * Before reading further, make sure `MathComponent` doesn't cover your use case.
 *
 * To use, provide inputs to this hook (eg. source, source language,
 * display/inline), then spread `getProps()` onto the child you would like to
 * render the math in.
 */
export declare function useMathJax({ src, lang, display, settings, }: UseMathJaxProps): UseMathJaxReturn;
