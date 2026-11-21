import React from 'react'
import './footer.css'
import BrandIconFooter from '../icons/BrandIconFooter'
import SocialMedia from './SocialMedia'
import MethodCart from './MethodCart'
import FooterColumn1 from './FooterColumn'

const data = {
    socialMedia: [
        {
            id: 1,
            name: "Instagram",
            url: "https://cdn.simpleicons.org/instagram/ffffff",
            link: "https://www.instagram.com/"
        },
        {
            id: 2,
            name: "Facebook",
            url: "https://cdn.simpleicons.org/facebook/ffffff",
            link: "https://www.facebook.com/"
        },
        {
            id: 3,
            name: "GitHub",
            url: "https://cdn.simpleicons.org/github/ffffff",
            link: "/"
        },
        {
            id: 4,
            name: "TikTok",
            url: "https://cdn.simpleicons.org/tiktok/ffffff",
            link: "https://www.tiktok.com/"
        },
        {
            id: 5,
            name: "YouTube",
            url: "https://cdn.simpleicons.org/youtube/ffffff",
            link: "https://www.youtube.com/"
        }
    ],
    methodcart: [
        {
            id: 1,
            name: "VISA",
            url: "https://cdn.simpleicons.org/visa",
            link: "/linkdemo"
        },
        {
            id: 2,
            name: "Mastercard",
            url: "https://cdn.simpleicons.org/mastercard",
            link: "/linkdemo"
        },
        {
            id: 3,
            name: "PayPal",
            url: "https://cdn.simpleicons.org/paypal",
            link: "/linkdemo"
        },
        {
            id: 4,
            name: "Apple Pay",
            url: "https://cdn.simpleicons.org/applepay/ffffff",
            link: "/linkdemo"
        },
        {
            id: 5,
            name: "Google Pay",
            url: "https://cdn.simpleicons.org/googlepay",
            link: "/linkdemo"
        }
    ],
    title: [
        {
            id: 1,
            title: "Quick Links"
        },
        {
            id: 2,
            title: "Customer Care"
        },
        {
            id: 3,
            title: "Newsletter"
        }
    ],
    quickLink: [
        {
            id: 1,
            name: "Shop",
            url: "/"
        },
        {
            id: 2,
            name: "New Arrivals",
            url: "/"
        },
        {
            id: 3,
            name: "Collections",
            url: "/"
        },
        {
            id: 4,
            name: "About Us",
            url: "/"
        },
        {
            id: 5,
            name: "Blog",
            url: "/"
        },
        {
            id: 6,
            name: "Contact",
            url: "/"
        },
    ],
    customerCare: [
        {
            id: 1,
            name: "Shipping Policy",
            url: "/"
        },
        {
            id: 2,
            name: "Return & Refund",
            url: "/"
        },
        {
            id: 1,
            name: "Size Guide",
            url: "/"
        },
        {
            id: 1,
            name: "FAQs",
            url: "/"
        },
        {
            id: 1,
            name: "Term & Conditions",
            url: "/"
        },
        {
            id: 1,
            name: "Private & Policy",
            url: "/"
        },
    ]
}
const Footer2 = () => {
    const renderColumn = (items) => {
        const arrColumn = items.map((item) => {
            return (
                <FooterColumn1 key={item.id} item={item} />
            )
        })
        return arrColumn;
    }
    const renderMethodCart = () => {
        const arrMethodCart = data.methodcart.map((item) => {
            return (
                <MethodCart key={item.id} item={item} />
            )
        })
        return arrMethodCart;
    }
    const renderSocialMedia = () => {
        const arrSocialMedia = data.socialMedia.map((item) => {
            return (
                <SocialMedia key={item.id} item={item} />
            )
        })
        return arrSocialMedia;
    }
    return (
        <footer style={{ background: "#0e1b1f", padding: "50px 0" }}>
            <div className='container'>
                <div className='row'>
                    <div className='col-lg-3 col-12 footerLeft'>
                        <div className='wrapper brand'>
                            <a href='/'>
                                <BrandIconFooter />
                            </a>
                        </div>
                        <p className="text-white d-none d-lg-block">My journey, my choices.
                            Follow your passion, stay strong through hard times.
                            Keep trying today, and thank yourself tomorrow.
                        </p>
                        <div className='socal_media d-flex flex-wrap'>
                            {renderSocialMedia()}
                        </div>
                    </div>
                    <div className='col-lg-3 col-12 footerSecond'>
                        <div className='wrapper quickLinks'>
                            <h4 className='text-white'>Quick Links</h4>
                        </div>
                        {renderColumn(data.quickLink)}
                    </div>
                    <div className='col-lg-3 col-12 footer-third'>
                        <div className='wrapper customerCare'>
                            <h4 className='text-white'>Customer Care</h4>
                        </div>
                        {renderColumn(data.customerCare)}
                    </div>
                    <div className='col-lg-3 col-12 footer-final'>
                        <div className='wrapper newsletter'>
                            <h4 className='text-white'>Newsletter</h4>
                        </div>
                        <form style={{ position: "relative" }}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                                style={{ borderRadius: "8px" }}
                                className='w-100 p-3 border-0'
                            />
                            <button type="submit" aria-label="Subscribe" className='border-0' style={{ background: "#f55f8d", position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "6px" }}>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </form>
                        <p className="text-white text-decoration-none d-none d-lg-block">Subscribe to get special offers, free giveaways and once-in-a-lifetime deals.</p>
                        <div className='method_cart d-flex flex-wrap'>
                            {renderMethodCart()}
                        </div>
                    </div>
                    <div className='footer-copyright'>
                        <hr className="border-white opacity-25" />
                        <div className='row' style={{ color: "white" }}>
                            <div className='col-lg-6'>
                                © 2026 TrendSol. All rights reserved.
                            </div>
                            <div className='col-lg-6 text-end d-none d-lg-block'>
                                <span>Style</span>
                                <span className='p-3'>/</span>
                                <span>Comfort</span>
                                <span className='p-3'>/</span>
                                <span>Confidence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer2
