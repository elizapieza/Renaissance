'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type TextSize = 'default' | 'large' | 'x-large';

type AccessibilityContextType = {
    textSize: TextSize;
    setTextSize: (size: TextSize) => void;

    reducedMotion: boolean;
    setReducedMotion: (value: boolean) => void;

    highContrast: boolean;
    setHighContrast: (value: boolean) => void;

    colorSafeMode: boolean;
    setColorSafeMode: (value: boolean) => void;

    resetAccessibility: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {

    const [textSize, setTextSize] = useState<TextSize>('default');
    const [reducedMotion, setReducedMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [colorSafeMode, setColorSafeMode] = useState(false);


    useEffect(() => {
        const savedTextSize = localStorage.getItem('a11y-text-size') as TextSize | null;
        const savedReducedMotion = localStorage.getItem('a11y-reduced-motion');
        const savedHighContrast = localStorage.getItem('a11y-high-contrast');
        const savedColorSafeMode = localStorage.getItem('a11y-color-safe');

        if (savedTextSize) setTextSize(savedTextSize);
        if (savedReducedMotion) setReducedMotion(savedReducedMotion === 'true');
        if (savedHighContrast) setHighContrast(savedHighContrast === 'true');
        if (savedColorSafeMode) setColorSafeMode(savedColorSafeMode === 'true');
    }, []);

    useEffect(() => {
        localStorage.setItem('a11y-text-size', textSize);
        localStorage.setItem('a11y-reduced-motion', String(reducedMotion));
        localStorage.setItem('a11y-high-contrast', String(highContrast));
        localStorage.setItem('a11y-color-safe', String(colorSafeMode));
    }, [textSize, reducedMotion, highContrast, colorSafeMode]);


    useEffect(() => {
        const root = document.documentElement;

        root.setAttribute('data-text-size', textSize);
        root.setAttribute('data-reduced-motion', String(reducedMotion));
        root.setAttribute('data-high-contrast', String(highContrast));
        root.setAttribute('data-color-safe', String(colorSafeMode));

        if (reducedMotion) {
            root.style.scrollBehavior = 'auto';
        } else {
            root.style.scrollBehavior = 'smooth';
        }
    }, [textSize, reducedMotion, highContrast, colorSafeMode]);

    const resetAccessibility = () => {
        setTextSize('default');
        setReducedMotion(false);
        setHighContrast(false);
        setColorSafeMode(false);
    };

    const value = useMemo(
        () => ({
            textSize,
            setTextSize,
            reducedMotion,
            setReducedMotion,
            highContrast,
            setHighContrast,
            colorSafeMode,
            setColorSafeMode,
            resetAccessibility,
        }),
        [textSize, reducedMotion, highContrast, colorSafeMode]
    );

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);

    if (!context) {
        throw new Error('useAccessibility must be used inside AccessibilityProvider');
    }

    return context;
}