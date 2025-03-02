import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 py-12 animate-fadeIn">
            <div className="container mx-auto px-4 text-center">
                {/* Copyright Notice */}
                <p className="text-gray-300 text-lg font-semibold mb-2">
                    &copy; {new Date().getFullYear()} Matrix
                </p>
                <p className="text-gray-400 text-sm text-opacity-80">
                    All rights reserved.
                </p>

                {/* Decorative Element */}
                <div className="mt-6 flex justify-center">
                    <div className="w-16 h-1 bg-yellow-500 rounded-full"></div>
                </div>

                {/* Vercel Badge */}
                <div className="mt-6">
                    <a
                        href="https://vercel.com/?utm_source=your-site&utm_campaign=oss"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block opacity-80 hover:opacity-100 transition-opacity"
                        aria-label="Powered by Vercel"
                    >
                        <img
                            src="/powered-by-vercel.svg"
                            alt="Powered by Vercel"
                            className="h-8"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
