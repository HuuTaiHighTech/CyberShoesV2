const SearchBar = () => {
    return (
        <div className="site-search" role="search">
            <input
                className="site-search-input"
                type="search"
                name="q"
                placeholder="Search for shoes..."
                aria-label="Search for shoes"
            />
            <svg
                className="site-search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        </div>
    )
}

export default SearchBar
