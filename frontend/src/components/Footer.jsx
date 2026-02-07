import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-xl mb-4">HotelBook</h3>
                        <p className="text-gray-400">
                            Find and book hotels worldwide with the best prices.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Contact Us</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-white">Aadesh Minz</p>
                                <a href="mailto:aadeshminz31@gmail.com" className="text-gray-400 hover:text-white text-sm">
                                    aadeshminz31@gmail.com
                                </a>
                                <br />
                                <a
                                    href="https://www.linkedin.com/in/aadesh-minz-802391218"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mt-1"
                                >
                                    <FaLinkedin className="text-lg" />
                                    LinkedIn Profile
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">&nbsp;</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-white">Sai Shiva Sheelampally</p>
                                <a href="mailto:saishivasheelampally@gmail.com" className="text-gray-400 hover:text-white text-sm">
                                    saishivasheelampally@gmail.com
                                </a>
                                <br />
                                <a
                                    href="http://www.linkedin.com/in/sai-shiva-s-941410227"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mt-1"
                                >
                                    <FaLinkedin className="text-lg" />
                                    LinkedIn Profile
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <FaFacebook className="text-2xl cursor-pointer hover:text-primary-400" />
                            <FaTwitter className="text-2xl cursor-pointer hover:text-primary-400" />
                            <FaInstagram className="text-2xl cursor-pointer hover:text-primary-400" />
                            <FaLinkedin className="text-2xl cursor-pointer hover:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2026 Hotel Booking System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
