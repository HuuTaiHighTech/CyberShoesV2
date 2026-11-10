import React from 'react'
import BrandIcon from '../icons/BrandIcon'

const MobileMenuModal = (props) => {
    const { renderNavbar } = props;
    return (
        <div
            className="modal show mobile-fullscreen-modal"
            tabIndex="-1"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} /* CSS để ép Modal hiện ra và có nền đen */
        >
            <div
                className={`modal-dialog`}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <BrandIcon/>
                        {/* Dùng onClick để ĐÓNG Modal thay vì dùng data-bs-dismiss */}
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                        ></button>
                    </div>
                    {/* Cho Danh sách Menu vào thẻ Body của Modal */}
                    <div className="modal-body d-flex flex-column p-3">
                        {renderNavbar()}
                    </div>
                    <div className="modal-footer">
                        <p className="w-100 text-center mb-0">© 2026 TrendSol. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileMenuModal
