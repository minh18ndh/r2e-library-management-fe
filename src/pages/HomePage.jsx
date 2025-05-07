import { useEffect, useState } from 'react';

const HomePage = () => {
  const fullText = 'Welcome to Maison des Livres - your personal library management system.';
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#3a3a4f] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-2 text-center animate-pulse">
        📚 Maison des Livres
      </h1>
      <p className="text-lg text-gray-300 text-center max-w-xl font-mono h-8">
        {displayedText}
      </p>
    </div>
  );
};

export default HomePage;