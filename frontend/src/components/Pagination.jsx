import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-between items-center mt-6 px-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Showing Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-[10px] font-black uppercase border border-primary/10 rounded-lg hover:bg-secondary disabled:opacity-30 transition-all"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-[10px] font-black uppercase bg-primary text-secondary rounded-lg hover:bg-accent transition-all disabled:opacity-30"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;