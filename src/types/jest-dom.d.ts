import "@testing-library/jest-dom";

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
            toHaveTextContent(text: string | RegExp): R;
            toBeVisible(): R;
            toBeDisabled(): R;
            toBeEnabled(): R;
            toHaveAttribute(attr: string, value?: string): R;
            toHaveClass(...classNames: string[]): R;
            toHaveFocus(): R;
            toBeChecked(): R;
            toBeEmpty(): R;
            toBeRequired(): R;
        }
    }
}
