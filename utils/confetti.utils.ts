import confetti from "canvas-confetti";

interface ConfettiProps {
  element: HTMLElement;
}

export default function throwConfettiOnElement({
  element,
}: ConfettiProps): void {
  if (element) {
    const rect = element.getBoundingClientRect();
    // console.log("element position:", rect);
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    // console.log("Confetti origin:", { x, y });

    // Trigger confetti from the button's position
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { x, y },
      ticks: 200,
    });
  } else {
    // console.log("Element not found, falling back to center");
    // Fallback to center if button not found
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      ticks: 200,
    });
  }
}
