const Paging = ({ currentPage, totalPages, onPageChange, disabled = false }) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className="d-flex justify-content-center mt-4" aria-label="Product pages">
            <ul className="pagination">
                <li className={`page-item ${currentPage <= 1 || disabled ? "disabled" : ""}`}>
                    <button
                        type="button"
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || disabled}
                        aria-label="Previous page"
                    >
                        Previous
                    </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <li
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                        key={page}
                    >
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => onPageChange(page)}
                            disabled={disabled || currentPage === page}
                            aria-current={currentPage === page ? "page" : undefined}
                        >
                            {page}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage >= totalPages || disabled ? "disabled" : ""}`}>
                    <button
                        type="button"
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || disabled}
                        aria-label="Next page"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Paging;
