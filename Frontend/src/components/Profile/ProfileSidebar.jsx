import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/user";
import api from "../../api/axios";
import { toast } from "react-toastify";

import { AiOutlineLogin } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from 'react-icons/rx';
import { MdOutlineSwapHoriz, MdOutlineMessage } from "react-icons/md";

import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";


const ProfileSideBar = ({ active, setActive, userPoints = 0 }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [expandMyOrders, setExpandMyOrders] = useState(false);
    const [expandExchange, setExpandExchange] = useState(false);

    const ordersActive = active === 3 || active === 3.1 || active === 3.2;
    const exchangeActive = active === 4 || active === 4.1 || active === 4.2;

    useEffect(() => {
        if (active === 3.1 || active === 3.2) {
            setExpandMyOrders(true);
        }
        if (active === 4.1 || active === 4.2) {
            setExpandExchange(true);
        }
    }, [active]);

    const menuItems = [
        { id: 1, label: "My Profile", icon: RxPerson },
        { id: 2, label: "My Books", icon: HiOutlineShoppingBag },
    ];

    const handleLogout = async () => {
        try {
            await api.get("/v2/user/logout");
            dispatch(logout());
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            navigate("/");
            toast.success("Logged out successfully!");
            window.location.reload(); // Refresh to clear all states
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };


    return (
        <div className='w-full bg-white shadow-sm rounded-lg p-6'>

            {/* User Points Display */}
            <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                   <User className="text-lg text-[#D98C00]" />
                    <h2 className="text-xl font-bold text-gray-800">
                        User Dashboard
                    </h2>
                </div>
            </div>
            {/* My Profile */}
            <div
                className={`flex items-center cursor-pointer w-full mb-6 p-3 rounded-lg transition-all duration-200 ${active === 1 ? "bg-[#D98C00]/10 border-l-4 border-[#D98C00]" : "hover:bg-gray-50"
                    }`}
                onClick={() => setActive(1)}
            >
                <RxPerson size={22} color={active === 1 ? "#D98C00" : "#666"} />
                <span className={`pl-4 font-medium text-sm ${active === 1 ? "text-[#D98C00]" : "text-gray-700"}`}>
                    My Profile
                </span>
            </div>

            {/* My Books */}
            <div
                className={`flex items-center cursor-pointer w-full mb-6 p-3 rounded-lg transition-all duration-200 ${active === 2 ? "bg-[#D98C00]/10 border-l-4 border-[#D98C00]" : "hover:bg-gray-50"
                    }`}
                onClick={() => setActive(2)}
            >
                <HiOutlineShoppingBag size={22} color={active === 2 ? "#D98C00" : "#666"} />
                <span className={`pl-4 font-medium text-sm ${active === 2 ? "text-[#D98C00]" : "text-gray-700"}`}>
                    My Books
                </span>
            </div>

            {/* My Orders - Dropdown */}
            <div className="mb-6">
                <div
                    className={`flex items-center justify-between cursor-pointer w-full p-3 rounded-lg transition-all duration-200 ${ordersActive ? "bg-[#D98C00]/10 border-l-4 border-[#D98C00]" : "hover:bg-gray-50"
                        }`}
                    onClick={() => setExpandMyOrders(!expandMyOrders)}
                >
                    <div className="flex items-center">
                        <HiOutlineShoppingBag size={22} color={ordersActive ? "#D98C00" : "#666"} />
                        <span className={`pl-4 font-medium text-sm ${ordersActive ? "text-[#D98C00]" : "text-gray-700"}`}>
                            My Orders
                        </span>
                    </div>
                    {expandMyOrders ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
                </div>

                {/* Dropdown Items */}
                {expandMyOrders && (
                    <div className="ml-4 mt-2 space-y-2">
                        <div
                            className={`flex items-center cursor-pointer p-2.5 rounded-md transition-all duration-200 text-sm ${active === 3.1 ? "bg-[#D98C00]/10 text-[#D98C00] font-semibold" : "text-gray-600 hover:text-[#D98C00]"
                                }`}
                            onClick={() => setActive(3.1)}
                        >
                            • Order Placed
                        </div>
                        <div
                            className={`flex items-center cursor-pointer p-2.5 rounded-md transition-all duration-200 text-sm ${active === 3.2 ? "bg-[#D98C00]/10 text-[#D98C00] font-semibold" : "text-gray-600 hover:text-[#D98C00]"
                                }`}
                            onClick={() => setActive(3.2)}
                        >
                            • Order Received
                        </div>
                    </div>
                )}
            </div>

            {/* Exchange Request - Dropdown */}
            <div className="mb-6">
                <div
                    className={`flex items-center justify-between cursor-pointer w-full p-3 rounded-lg transition-all duration-200 ${exchangeActive ? "bg-[#D98C00]/10 border-l-4 border-[#D98C00]" : "hover:bg-gray-50"
                        }`}
                    onClick={() => setExpandExchange(!expandExchange)}
                >
                    <div className="flex items-center">
                        <MdOutlineSwapHoriz size={22} color={exchangeActive ? "#D98C00" : "#666"} />
                        <span className={`pl-4 font-medium text-sm ${exchangeActive ? "text-[#D98C00]" : "text-gray-700"}`}>
                            Exchange Request
                        </span>
                    </div>
                    {expandExchange ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
                </div>

                {/* Dropdown Items */}
                {expandExchange && (
                    <div className="ml-4 mt-2 space-y-2">
                        <div
                            className={`flex items-center cursor-pointer p-2.5 rounded-md transition-all duration-200 text-sm ${active === 4.1 ? "bg-[#D98C00]/10 text-[#D98C00] font-semibold" : "text-gray-600 hover:text-[#D98C00]"
                                }`}
                            onClick={() => setActive(4.1)}
                        >
                            • Send Request
                        </div>
                        <div
                            className={`flex items-center cursor-pointer p-2.5 rounded-md transition-all duration-200 text-sm ${active === 4.2 ? "bg-[#D98C00]/10 text-[#D98C00] font-semibold" : "text-gray-600 hover:text-[#D98C00]"
                                }`}
                            onClick={() => setActive(4.2)}
                        >
                            • Received Request
                        </div>
                    </div>
                )}
            </div>

            {/* Complaints */}
            <div
                className={`flex items-center cursor-pointer w-full mb-6 p-3 rounded-lg transition-all duration-200 ${active === 5 ? "bg-[#D98C00]/10 border-l-4 border-[#D98C00]" : "hover:bg-gray-50"
                    }`}
                onClick={() => setActive(5)}
            >
                <MdOutlineMessage size={22} color={active === 5 ? "#D98C00" : "#666"} />
                <span className={`pl-4 font-medium text-sm ${active === 5 ? "text-[#D98C00]" : "text-gray-700"}`}>
                    Complaints
                </span>
            </div>

            {/* Logout */}
            <div
                className="flex items-center cursor-pointer w-full p-3 rounded-lg transition-all duration-200 hover:bg-red-50 group mt-8 pt-6 border-t border-gray-200"
                onClick={handleLogout}
            >
                <AiOutlineLogin size={22} className="text-red-500 group-hover:text-red-600" />
                <span className="pl-4 font-medium text-sm text-red-500 group-hover:text-red-600">
                    Logout
                </span>
            </div>
        </div>
    )
}

export default ProfileSideBar