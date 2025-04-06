import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { Bell, Lock, User, Shield, Globe, Fingerprint, BellOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  
  // Form states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been updated successfully.",
    });
  };
  
  const handleSaveSecurity = () => {
    toast({
      title: "Security settings updated",
      description: "Your security settings have been updated successfully.",
    });
  };
  
  const handleSaveAppearance = () => {
    toast({
      title: "Appearance settings updated",
      description: "Your appearance settings have been updated successfully.",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 mb-1">Settings</h1>
        <p className="text-neutral-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-0">
            <div className="flex flex-col space-y-1 p-4">
              <button
                className={`flex items-center space-x-3 text-left px-3 py-2 rounded-md ${activeTab === 'account' ? 'bg-primary-50 text-primary-700' : 'hover:bg-neutral-100'}`}
                onClick={() => setActiveTab('account')}
              >
                <User className="h-5 w-5" />
                <span>Account</span>
              </button>
              <button
                className={`flex items-center space-x-3 text-left px-3 py-2 rounded-md ${activeTab === 'notifications' ? 'bg-primary-50 text-primary-700' : 'hover:bg-neutral-100'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </button>
              <button
                className={`flex items-center space-x-3 text-left px-3 py-2 rounded-md ${activeTab === 'security' ? 'bg-primary-50 text-primary-700' : 'hover:bg-neutral-100'}`}
                onClick={() => setActiveTab('security')}
              >
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </button>
              <button
                className={`flex items-center space-x-3 text-left px-3 py-2 rounded-md ${activeTab === 'appearance' ? 'bg-primary-50 text-primary-700' : 'hover:bg-neutral-100'}`}
                onClick={() => setActiveTab('appearance')}
              >
                <Globe className="h-5 w-5" />
                <span>Appearance</span>
              </button>
            </div>
            
            <Separator />
            
            <div className="p-4">
              <div className="flex items-center space-x-3 text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer">
                <AlertTriangle className="h-5 w-5" />
                <span>Delete Account</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details and public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-start">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={user?.fullName} />
                      <AvatarFallback>{user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" size="sm" className="mt-2">
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" defaultValue={user?.fullName || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue={user?.username || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user?.email || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" defaultValue={user?.department || ""} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" className="min-h-[100px]" placeholder="Write a short bio about yourself..." />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-neutral-500">Receive email updates about governance activities</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-neutral-500">Receive push notifications in your browser</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-neutral-500">Receive text messages for critical alerts</p>
                    </div>
                    <Switch 
                      id="sms-notifications" 
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="system-updates" />
                      <Label htmlFor="system-updates">System Updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="new-records" defaultChecked />
                      <Label htmlFor="new-records">New Public Records</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="report-updates" defaultChecked />
                      <Label htmlFor="report-updates">Citizen Report Updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="anomaly-alerts" defaultChecked />
                      <Label htmlFor="anomaly-alerts">AI Anomaly Alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="budget-changes" />
                      <Label htmlFor="budget-changes">Budget Changes</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  
                  <Button className="mt-2">Update Password</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>
                  
                  {twoFactorAuth && (
                    <div className="mt-4 p-4 bg-neutral-50 rounded-md">
                      <div className="flex items-start">
                        <Fingerprint className="h-5 w-5 text-primary-600 mt-0.5 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-neutral-900">Two-factor authentication is enabled</h3>
                          <p className="text-xs text-neutral-600 mt-1">
                            Your account is now more secure. You'll need to enter a verification code when you sign in.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Configure 2FA
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session Management</h3>
                  <p className="text-sm text-neutral-500">Manage your active sessions and sign out from other devices</p>
                  
                  <div className="space-y-2">
                    <div className="p-4 border border-neutral-200 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Current Session</h4>
                          <p className="text-sm text-neutral-500">Chrome on Windows • IP: 192.168.1.1</p>
                          <p className="text-xs text-neutral-400">Active now</p>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-neutral-200 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Safari on MacOS</h4>
                          <p className="text-sm text-neutral-500">IP: 192.168.1.5</p>
                          <p className="text-xs text-neutral-400">Last active: 2 days ago</p>
                        </div>
                        <Button variant="outline" size="sm">Sign Out</Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-neutral-200 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Mobile App on iPhone</h4>
                          <p className="text-sm text-neutral-500">IP: 192.168.1.10</p>
                          <p className="text-xs text-neutral-400">Last active: 5 days ago</p>
                        </div>
                        <Button variant="outline" size="sm">Sign Out</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-2">
                    Sign Out All Other Sessions
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSecurity}>Save Security Settings</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the platform looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>
                  
                  <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem
                        value="light"
                        id="theme-light"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-neutral-200 bg-white p-4 hover:bg-neutral-100 hover:border-neutral-300 cursor-pointer [&:has([data-state=checked])]:border-primary-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-3 h-6 w-6"
                        >
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2" />
                          <path d="M12 20v2" />
                          <path d="m4.93 4.93 1.41 1.41" />
                          <path d="m17.66 17.66 1.41 1.41" />
                          <path d="M2 12h2" />
                          <path d="M20 12h2" />
                          <path d="m6.34 17.66-1.41 1.41" />
                          <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                        <span className="block w-full text-center">Light</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="dark"
                        id="theme-dark"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-neutral-200 bg-white p-4 hover:bg-neutral-100 hover:border-neutral-300 cursor-pointer [&:has([data-state=checked])]:border-primary-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-3 h-6 w-6"
                        >
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                        <span className="block w-full text-center">Dark</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="system"
                        id="theme-system"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="theme-system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-neutral-200 bg-white p-4 hover:bg-neutral-100 hover:border-neutral-300 cursor-pointer [&:has([data-state=checked])]:border-primary-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-3 h-6 w-6"
                        >
                          <rect width="20" height="14" x="2" y="3" rx="2" />
                          <line x1="8" x2="16" y1="21" y2="21" />
                          <line x1="12" x2="12" y1="17" y2="21" />
                        </svg>
                        <span className="block w-full text-center">System</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Language</h3>
                  
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accessibility</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reduced-motion">Reduce Motion</Label>
                      <Switch id="reduced-motion" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <Switch id="high-contrast" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="larger-text">Larger Text</Label>
                      <Switch id="larger-text" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveAppearance}>Save Appearance Settings</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Missing import we need to define
function Checkbox({ id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
        {...props}
      />
    </div>
  );
}

// Missing import we need to define  
function Badge({ children, variant = "default", className = "" }: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive";
  className?: string;
}) {
  const variantClasses = {
    default: "bg-primary-100 text-primary-800 border-primary-200",
    secondary: "bg-neutral-100 text-neutral-800 border-neutral-200",
    outline: "bg-transparent border-neutral-200 text-neutral-800",
    destructive: "bg-red-100 text-red-800 border-red-200"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
