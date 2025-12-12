import React, { useState, useEffect } from "react";
import { HomeHeader } from "../components/home-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Footer from "@/components/Footer";
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Camera, 
  Loader2,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";

const AccountSetting: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userName, userEmail, avatarUrl, refetch } = useUserProfile();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Email verification state
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  useEffect(() => {
    if (userName) setName(userName);
    if (userEmail) setEmail(userEmail);
    if (avatarUrl) setAvatar(avatarUrl);
  }, [userName, userEmail, avatarUrl]);

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsEmailVerified(!!user.email_confirmed_at);
      }
    };
    checkEmailVerification();
  }, []);

  const handleResendVerification = async () => {
    if (!email) return;
    
    setIsResendingVerification(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your inbox and click the verification link",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send email",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-images')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAvatar(publicUrl);
      refetch();
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated",
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('user_id', user.id);

      if (error) throw error;

      refetch();
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand-green text-black text-sm sm:text-base m-4 py-2 text-center font-medium rounded-md sm:hidden">
        <a href="/free-courses" className="hover:underline">
          Free Courses 🌟 Sale Ends Soon, Get It Now →
        </a>
      </div>
      <HomeHeader 
        search="" 
        onSearchChange={() => {}}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-2 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold font-vietnam text-foreground">Account Settings</h1>
          <p className="text-muted-foreground font-vietnam text-sm sm:text-base">
            Manage your account preferences
          </p>
        </div>
        <div className="w-full h-[1px] bg-border mb-6 sm:mb-8"></div>

        <div className="space-y-6 sm:space-y-8">
          {/* Profile Info Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                <User className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground font-vietnam">Profile Info</h2>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-muted ring-2 ring-border">
                  <img 
                    src={avatar || "/assets/dashboard-images/face.jpg"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-green-hover transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 text-black animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-black" />
                  )}
                </label>
                <input 
                  type="file" 
                  id="avatar-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
              </div>
              <div>
                <p className="text-foreground font-medium font-vietnam">{name || "Your Name"}</p>
                <p className="text-muted-foreground text-sm font-vietnam">{email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-muted-foreground font-vietnam text-sm mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background border-border text-foreground font-vietnam placeholder:text-muted-foreground focus:ring-1 focus:ring-brand-green w-full"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-muted-foreground font-vietnam text-sm mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted border-border text-muted-foreground font-vietnam cursor-not-allowed w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                
                {/* Email Verification Status */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  {isEmailVerified === null ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking verification status...</span>
                    </div>
                  ) : isEmailVerified ? (
                    <div className="flex items-center gap-2 text-green-500 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-medium">Email verified</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2 text-amber-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Email not verified</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={isResendingVerification}
                        className="border-border text-foreground hover:bg-muted font-vietnam text-xs h-7 w-fit"
                      >
                        {isResendingVerification ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 mr-1" />
                            Resend verification
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-brand-green hover:bg-brand-green-hover text-black font-vietnam font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-vietnam text-foreground">Security</h2>
            </div>

            {!showPasswordSection ? (
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordSection(true)}
                className="border-border text-foreground hover:bg-muted font-vietnam"
              >
                Change Password
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="new-password" className="text-muted-foreground font-vietnam text-sm mb-2 block">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-background border-border text-foreground font-vietnam pr-10 w-full"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-muted-foreground font-vietnam text-sm mb-2 block">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background border-border text-foreground font-vietnam w-full"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handlePasswordChange}
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="bg-brand-green hover:bg-brand-green-hover text-black font-vietnam font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPasswordSection(false);
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="border-border text-foreground hover:bg-muted font-vietnam"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                <Bell className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-vietnam text-foreground">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-foreground font-vietnam font-medium">Email Notifications</p>
                  <p className="text-muted-foreground text-sm font-vietnam">Receive updates via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                  className="data-[state=checked]:bg-brand-green"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-foreground font-vietnam font-medium">Push Notifications</p>
                  <p className="text-muted-foreground text-sm font-vietnam">Receive in-app notifications</p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications}
                  className="data-[state=checked]:bg-brand-green"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-foreground font-vietnam font-medium">Marketing Emails</p>
                  <p className="text-muted-foreground text-sm font-vietnam">Receive promotional content</p>
                </div>
                <Switch 
                  checked={marketingEmails} 
                  onCheckedChange={setMarketingEmails}
                  className="data-[state=checked]:bg-brand-green"
                />
              </div>
            </div>
          </div>

          {/* Billing Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-vietnam text-foreground">Billing</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-muted-foreground font-vietnam text-sm">
                  Billing is handled securely through Paystack. Your payment information is not stored on our servers.
                </p>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => navigate("/mylibrary")}
                className="border-border text-foreground hover:bg-muted font-vietnam"
              >
                View Purchase History
              </Button>
            </div>
          </div>

          {/* Sign Out Section */}
          <div className="bg-card border border-destructive/30 rounded-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-destructive/10 rounded flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-vietnam text-foreground">Sign Out</h2>
            </div>
            <p className="text-muted-foreground font-vietnam text-sm mb-4">
              Sign out of your account on this device
            </p>
            <Button 
              variant="destructive"
              onClick={handleSignOut}
              className="font-vietnam"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountSetting;
