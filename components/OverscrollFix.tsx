"use client";

export default function OverscrollFix() {
    return (
        <style jsx global>{`
            html, body {
                overscroll-behavior: none;
            }
        `}</style>
    );
}
