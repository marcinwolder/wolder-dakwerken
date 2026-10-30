export const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

// Tapping a button normally blurs the focused input first. On iOS (e.g. after autofill) the
// keyboard then closes, the layout shifts and the tap is lost, so the first click does nothing.
export const keepInputFocus = (e: { preventDefault: () => void }) => e.preventDefault();
