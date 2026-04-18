'use client';

import { useState } from 'react';
import { RiAccessibilityLine } from 'react-icons/ri';
import { useAccessibility } from './accessibilityProvider';

export default function AccessibilityMenu() {
    const [open, setOpen] = useState(false);

    const {
        textSize,
        setTextSize,
        reducedMotion,
        setReducedMotion,
        highContrast,
        setHighContrast,
        colorSafeMode,
        setColorSafeMode,
        resetAccessibility,
    } = useAccessibility();

    return (
        <div className="fixed bottom-4 left-4 z-[60]">
            <div className="relative">
                {open && (
                    <div
                        id="accessibility-panel"
                        className="absolute bottom-[calc(100%+12px)] left-0 w-72 rounded-xl border-4 border-black bg-[#FFF8D8] p-4 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <div className="mb-3">
                            <h2 className="text-lg font-bold">Accessibility</h2>
                            <p className="text-sm text-gray-700">
                                Adjust the display to make Renaissance easier to use.
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-semibold">Text size</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setTextSize('default')}
                                    className={`rounded-md border-2 px-3 py-2 text-sm font-semibold ${
                                        textSize === 'default'
                                            ? 'border-black bg-yellow-300'
                                            : 'border-black bg-white'
                                    }`}
                                >
                                    Default
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTextSize('large')}
                                    className={`rounded-md border-2 px-3 py-2 text-sm font-semibold ${
                                        textSize === 'large'
                                            ? 'border-black bg-yellow-300'
                                            : 'border-black bg-white'
                                    }`}
                                >
                                    Large
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTextSize('x-large')}
                                    className={`rounded-md border-2 px-3 py-2 text-sm font-semibold ${
                                        textSize === 'x-large'
                                            ? 'border-black bg-yellow-300'
                                            : 'border-black bg-white'
                                    }`}
                                >
                                    X-Large
                                </button>
                            </div>
                        </div>

                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="font-semibold">Reduce motion</p>
                                <p className="text-xs text-gray-700">
                                    Lowers animated movement for comfort.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={reducedMotion}
                                onChange={(e) => setReducedMotion(e.target.checked)}
                                aria-label="Toggle reduced motion"
                                className="h-5 w-5"
                            />
                        </div>

                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="font-semibold">High contrast</p>
                                <p className="text-xs text-gray-700">
                                    Increases contrast for better readability.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={highContrast}
                                onChange={(e) => setHighContrast(e.target.checked)}
                                aria-label="Toggle high contrast"
                                className="h-5 w-5"
                            />
                        </div>

                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="font-semibold">Color-safe mode</p>
                                <p className="text-xs text-gray-700">
                                    Uses safer visual distinctions with less reliance on color alone.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={colorSafeMode}
                                onChange={(e) => setColorSafeMode(e.target.checked)}
                                aria-label="Toggle color-safe mode"
                                className="h-5 w-5"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={resetAccessibility}
                            className="w-full rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                        >
                            Reset display settings
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    aria-controls="accessibility-panel"
                    aria-label="Open accessibility settings"
                    className="rounded-full border-3 border-yellow-400 bg-[#3A2E1F] p-2 text-white transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-300 bm-4"
                >
                    <RiAccessibilityLine size={28} />
                </button>
            </div>
        </div>
    );
}