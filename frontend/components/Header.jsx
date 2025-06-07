'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Menu, 
  X,
  Stethoscope,
  Shield,
  UserCheck,
  Calendar,
  FileText,
  Users,
  DollarSign
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getProfile } from '@/lib/api';

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Redirect to login if no valid session
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
    ];

    switch (user.role) {
      case 'admin':
        return [
            ...baseItems,
            { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
            { name: 'Staff Management', href: '/admin/staff', icon: Users },
            { name: 'Patient Management', href: '/admin/patient', icon: Users },
            { name: 'Finances', href: '/admin/finances', icon: DollarSign },
        ];
      
      case 'doctor':
        return [
          ...baseItems,
          { name: 'My Appointments', href: '/staff', icon: Calendar },
          { name: 'Patients', href: '/staff/patients', icon: UserCheck },
        ];
      
        case 'patient':
            return [
              ...baseItems,
              { name: 'Book Appointment', href: '/patient', icon: Calendar },
              { name: 'My Appointments', href: '/patient/appointments', icon: FileText },
            ];
      
      default:
        return baseItems;
    }
  };

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'doctor':
        return '/staff';
      case 'patient':
        return '/patient';
      default:
        return '/';
    }
  };

  // Get user role icon
  const getRoleIcon = () => {
    if (!user) return User;
    
    switch (user.role) {
      case 'admin':
        return Shield;
      case 'doctor':
        return Stethoscope;
      case 'patient':
        return UserCheck;
      default:
        return User;
    }
  };

  // Get user role color
  const getRoleColor = () => {
    if (!user) return 'text-gray-600';
    
    switch (user.role) {
      case 'admin':
        return 'text-red-600';
      case 'doctor':
        return 'text-blue-600';
      case 'patient':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get role display name
  const getRoleDisplayName = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'admin':
        return 'Administrator';
      case 'doctor':
        return 'Doctor';
      case 'patient':
        return 'Patient';
      default:
        return user.role;
    }
  };

  const navigationItems = getNavigationItems();
  const RoleIcon = getRoleIcon();

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href={getDashboardPath()} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="hidden font-bold text-xl text-gray-900 sm:inline-block hover:text-blue-600 transition-colors">
              MedEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                             (item.href.includes('?tab=') && pathname.includes(item.href.split('?')[0]));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 px-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user?.role === 'admin' ? 'bg-red-100' :
                    user?.role === 'doctor' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <RoleIcon className={`w-4 h-4 ${getRoleColor()}`} />
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className={`text-xs ${getRoleColor()}`}>
                      {getRoleDisplayName()}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <div className="flex items-center space-x-1">
                    <RoleIcon className={`w-3 h-3 ${getRoleColor()}`} />
                    <span className={`text-xs font-medium ${getRoleColor()}`}>
                      {getRoleDisplayName()}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              {
                 user?.role === 'patient' && 
              <DropdownMenuItem asChild>
                <Link href="/patient/me" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              }
              {
                 user?.role === 'staff' && 
              <DropdownMenuItem asChild>
                <Link href="/staff/me" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              }
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                             (item.href.includes('?tab=') && pathname.includes(item.href.split('?')[0]));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;