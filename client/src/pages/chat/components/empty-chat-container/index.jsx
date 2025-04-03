import { RiChatSmile2Line } from 'react-icons/ri';
import { BsArrowLeft, BsPlusCircle, BsPeople } from 'react-icons/bs';
import { motion } from 'framer-motion';

const EmptyChatContainer = () => {
    return (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center h-full min-h-screen bg-gradient-to-br from-[#0f1017] to-[#1a1b26] text-center p-8 border-l border-[#252632]">
            {/* Back button (mobile only) - removed absolute positioning */}
            <button className="md:hidden mb-6 text-gray-400 hover:text-white transition-colors self-start">
                <BsArrowLeft size={24} />
            </button>
            
            {/* Centered Content Container */}
            <div className="max-w-md w-full">
                {/* Animated Illustration */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#252632] to-[#1e1f2a] shadow-lg w-32 h-32 flex items-center justify-center"
                >
                    <RiChatSmile2Line className="text-indigo-400/80 text-5xl" />
                </motion.div>
                
                {/* Title */}
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 mb-3">
                    Spark Connections
                </h2>
                
                {/* Description */}
                <p className="text-gray-400/90 mb-8 text-lg">
                    Select a conversation or start a new one to begin messaging
                </p>
                
                {/* Action Buttons - now full width on mobile */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500/90 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl transition-all shadow-lg"
                    >
                        <BsPlusCircle size={18} />
                        New Chat
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }} 
                        className="flex-1 flex items-center justify-center gap-2 bg-[#252632] hover:bg-[#2d2e3a] border border-[#3a3b4c] text-white px-6 py-3.5 rounded-xl transition-all"
                    >
                        <BsPeople size={18} />
                        New Group
                    </motion.button>
                </div>
                
                {/* Security footer */}
                <motion.div
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center justify-center gap-2 mt-10 text-sm text-gray-500/80"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400/80"></div>
                    <span>End-to-end encrypted</span>
                </motion.div>
            </div>
        </div>
    );
};

export default EmptyChatContainer;