import { useNavigate } from 'react-router';
import { ReactNode, useState } from 'react';

// IMPORTANT: Put your actual email right here!
const MY_EMAIL = 'jdamley28@cmc.edu';

// Reusable Retro Window
const RetroWindow = ({ title, icon, children, className = '' }: { title: string, icon: string, children: ReactNode, className?: string }) => (
  <div className={`bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black flex flex-col shadow-2xl ${className}`}>
    <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <h2 className="font-bold text-xs md:text-sm tracking-wide truncate">{title}</h2>
      </div>
      <div className="flex gap-1 shrink-0 ml-2">
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center">_</button>
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center">□</button>
        <button onClick={() => window.history.back()} className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center hover:bg-red-400">X</button>
      </div>
    </div>
    <div className="flex-1 flex flex-col min-h-0">{children}</div>
  </div>
);

export function Contact() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [showDialog, setShowDialog] = useState(false);

  const handleSend = () => {
    const mailtoLink = `mailto:${MY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(MY_EMAIL);
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 relative font-sans">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <RetroWindow title="New Message - Windows Messaging" icon="✉️" className="w-full max-w-3xl h-[75vh] md:h-[80vh] z-10">
        
        {/* Menu Bar */}
        <div className="flex gap-4 px-2 py-1 text-sm bg-[#c0c0c0] border-b border-gray-500 shrink-0">
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">File</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Edit</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">View</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Insert</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Format</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Help</span>
        </div>

        {/* Action Toolbar */}
        <div className="flex gap-2 px-2 py-2 border-b-2 border-gray-500 bg-[#c0c0c0] shrink-0">
          <button 
            onClick={handleSend}
            className="flex flex-col items-center justify-center border-t border-l border-t-white border-l-white border-b-black border-r-black px-3 py-1 active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300 min-w-[60px]"
            title="Attempt to open default mail client"
          >
            <span className="text-xl mb-1">📬</span>
            <span className="text-xs font-bold">Send</span>
          </button>
          
          <button 
            onClick={handleCopyEmail}
            className="flex flex-col items-center justify-center border-t border-l border-t-white border-l-white border-b-black border-r-black px-3 py-1 active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300 min-w-[60px]"
            title="Copy email address to clipboard"
          >
            <span className="text-xl mb-1">📋</span>
            <span className="text-xs font-bold">Copy</span>
          </button>
          
          <div className="w-[2px] bg-gray-500 border-r border-white mx-1 my-1"></div>
          
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center border-t border-l border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300">✂️</button>
            <button className="w-8 h-8 flex items-center justify-center border-t border-l border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300">📋</button>
            <button className="w-8 h-8 flex items-center justify-center border-t border-l border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300">📝</button>
          </div>
        </div>

        {/* Header Fields - THE FIX IS HERE */}
        <div className="bg-[#c0c0c0] p-2 flex flex-col gap-2 shrink-0 border-b-2 border-gray-500">
          <div className="flex items-center gap-2">
            <button className="w-20 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-b-black border-r-black px-2 py-1 text-sm text-left active:border-t-black active:border-l-black active:border-b-white active:border-r-white">To...</button>
            <input 
              type="text" 
              readOnly 
              value={`Juhi Damley <${MY_EMAIL}>`} 
              className="flex-1 bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white px-2 py-1 text-sm text-black cursor-not-allowed font-sans font-bold"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 px-2 py-1 text-sm text-left text-gray-700">Subject:</div>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white px-2 py-1 text-sm text-black focus:outline-none focus:bg-[#ffffcc] font-sans"
            />
          </div>
        </div>

        {/* Formatting Bar */}
        <div className="flex items-center gap-2 px-2 py-1 bg-[#c0c0c0] shrink-0 border-b border-gray-500">
          <select className="bg-white border border-gray-400 text-sm shadow-inner px-1 outline-none font-sans">
            <option>Arial</option>
            <option>Times New Roman</option>
          </select>
          <div className="flex gap-1 ml-auto">
            <button className="w-6 h-6 flex items-center justify-center font-bold text-sm border border-transparent hover:border-gray-400">B</button>
            <button className="w-6 h-6 flex items-center justify-center italic text-sm border border-transparent hover:border-gray-400">I</button>
            <button className="w-6 h-6 flex items-center justify-center underline text-sm border border-transparent hover:border-gray-400">U</button>
          </div>
        </div>

        {/* Message Body */}
        <div className="flex-1 bg-[#c0c0c0] p-1 flex flex-col min-h-0 relative">
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 w-full bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white p-2 md:p-4 text-black font-sans text-sm md:text-base resize-none focus:outline-none focus:ring-0 shadow-inner"
            placeholder="Start typing your message here..."
          />

          {/* RETRO ALERT DIALOG OVERLAY */}
          {showDialog && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl w-80 flex flex-col">
                <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex justify-between items-center shrink-0">
                  <h2 className="font-bold text-sm">System Message</h2>
                  <button onClick={() => setShowDialog(false)} className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-red-400 flex items-center justify-center">X</button>
                </div>
                <div className="p-4 flex gap-4 items-start">
                  <div className="text-3xl">ℹ️</div>
                  <div className="text-sm text-black font-sans">
                    <p className="mb-4">Email address copied to clipboard!</p>
                    <p className="font-bold">{MY_EMAIL}</p>
                  </div>
                </div>
                <div className="flex justify-center p-3">
                  <button onClick={() => setShowDialog(false)} className="px-6 py-1 bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black text-black font-bold text-sm active:border-t-black active:border-l-black active:border-b-white active:border-r-white focus:outline-dotted focus:outline-1 focus:outline-black">
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* NEW STATUS BAR */}
        <div className="bg-[#c0c0c0] border-t border-white border-b border-gray-500 px-2 py-[2px] text-xs text-black flex justify-between shrink-0">
          <span>Ready</span>
          <span className="font-mono">{MY_EMAIL}</span>
        </div>

      </RetroWindow>

      {/* Start Button Overlay */}
      <button 
        onClick={() => navigate('/')}
        className="fixed bottom-4 left-4 bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 py-1 font-bold text-black flex items-center gap-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white z-50 shadow-xl"
      >
        <span className="text-xl leading-none">⊞</span> Start
      </button>

    </div>
  );
}