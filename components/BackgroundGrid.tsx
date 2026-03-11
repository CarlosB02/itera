"use client";

export default function BackgroundGrid() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated aurora blobs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] animate-pulse-glow" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/8 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-blue-500/6 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Floating particles */}
            <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-cyan-400/40 rounded-full animate-float" />
            <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 bg-fuchsia-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[60%] left-[20%] w-1 h-1 bg-blue-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[45%] right-[25%] w-1 h-1 bg-cyan-300/20 rounded-full animate-float" style={{ animationDelay: '3s' }} />
            <div className="absolute top-[70%] left-[60%] w-1.5 h-1.5 bg-fuchsia-300/25 rounded-full animate-float" style={{ animationDelay: '4s' }} />
            <div className="absolute top-[10%] left-[50%] w-1 h-1 bg-blue-300/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-[80%] right-[40%] w-1 h-1 bg-cyan-400/25 rounded-full animate-float" style={{ animationDelay: '2.5s' }} />
        </div>
    );
}
