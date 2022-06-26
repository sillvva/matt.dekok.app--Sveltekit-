export type Theme = "dark" | "light" | "blue";
export const themes: Theme[] = ["dark", "light", "blue"];

// The debounce function receives our function as a parameter
export const debounce = (fn: (...args: any[]) => void) => {
  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame: number;
  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params: any[]) => {
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) {
      cancelAnimationFrame(frame);
    }
    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {
      // Call our function and pass any params we received
      fn(...params);
    });
  };
};

export const conClasses = (str: boolean | string | (string | boolean | undefined)[]) => {
  return (Array.isArray(str) ? str : typeof str == "string" ? str.split(" ") : []).filter(s => !!s && typeof s == "string").join(" ");
};