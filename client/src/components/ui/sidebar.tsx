import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  FileText, 
  BarChart2, 
  Clock, 
  MessageSquare, 
  CreditCard, 
  Calendar, 
  Settings,
  Clipboard
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Make sure sidebar is shown when screen is large enough
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="h-5 w-5 mr-3" /> },
    { path: "/public-records", label: "Public Records", icon: <FileText className="h-5 w-5 mr-3" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart2 className="h-5 w-5 mr-3" /> },
    { path: "/recent-activities", label: "Recent Activities", icon: <Clock className="h-5 w-5 mr-3" /> },
    { path: "/citizen-reports", label: "Citizen Reports", icon: <MessageSquare className="h-5 w-5 mr-3" /> },
    { path: "/budget-tracking", label: "Budget Tracking", icon: <CreditCard className="h-5 w-5 mr-3" /> },
    { path: "/events-meetings", label: "Events & Meetings", icon: <Calendar className="h-5 w-5 mr-3" /> },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button 
        id="sidebar-toggle" 
        className="p-2 rounded-md lg:hidden hover:bg-neutral-100"
        onClick={toggleSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-600 bg-opacity-75 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`bg-white w-64 border-r border-neutral-200 transition-all duration-300 ${
          isOpen ? "fixed inset-y-0 left-0 z-40 lg:static lg:z-0" : "hidden lg:block"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4">
            <div className="bg-primary-50 text-primary-700 p-3 rounded-lg flex items-center">
              <Clipboard className="h-5 w-5 mr-2" />
              <div>
                <div className="font-medium text-sm">Report Issue</div>
                <div className="text-xs">Help improve governance</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-hide">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location === item.path
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {location === item.path ? (
                  <span className="text-primary-500">{item.icon}</span>
                ) : (
                  <span className="text-neutral-400">{item.icon}</span>
                )}
                {item.label}
              </Link>
            ))}

            <div className="pt-4 pb-2">
              <div className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Admin
              </div>
            </div>

            <Link 
              href="/settings"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                location === "/settings"
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {location === "/settings" ? (
                <Settings className="h-5 w-5 mr-3 text-primary-500" />
              ) : (
                <Settings className="h-5 w-5 mr-3 text-neutral-400" />
              )}
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
