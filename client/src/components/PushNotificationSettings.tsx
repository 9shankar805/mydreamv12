import { useState } from 'react';
import { Bell, BellOff, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function PushNotificationSettings() {
  const { toast } = useToast();
  const {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = usePushNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const handleToggleNotifications = async () => {
    setIsLoading(true);
    
    try {
      if (!isSubscribed) {
        if (permission === 'default') {
          const granted = await requestPermission();
          if (!granted) {
            toast({
              title: "Permission Required",
              description: "Please enable notifications in your browser settings to receive mobile notifications.",
              variant: "destructive"
            });
            setIsLoading(false);
            return;
          }
        }
        
        const success = await subscribe();
        if (success) {
          toast({
            title: "Notifications Enabled",
            description: "You'll now receive mobile notifications for orders, deliveries, and updates."
          });
        } else {
          toast({
            title: "Failed to Enable",
            description: "Could not enable push notifications. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        const success = await unsubscribe();
        if (success) {
          toast({
            title: "Notifications Disabled",
            description: "You'll no longer receive mobile notifications."
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleTestNotification = async () => {
    setIsLoading(true);
    
    try {
      await sendTestNotification();
      toast({
        title: "Test Sent",
        description: "Check your device's notification bar for the test notification."
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not send test notification.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Mobile Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in your browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile Notifications
        </CardTitle>
        <CardDescription>
          Get notified on your mobile device about orders, deliveries, and important updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Push Notifications
            </p>
            <p className="text-xs text-muted-foreground">
              Receive notifications in your device's notification bar
            </p>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleToggleNotifications}
            disabled={isLoading || permission === 'denied'}
          />
        </div>

        {permission === 'denied' && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            Notifications are blocked in your browser. Please enable them in your browser settings.
          </div>
        )}

        {isSubscribed && (
          <Button 
            onClick={handleTestNotification}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <Bell className="mr-2 h-4 w-4" />
            Send Test Notification
          </Button>
        )}

        {/* Mobile-specific notification features */}
        <div className="rounded-lg bg-blue-50 p-3 text-sm">
          <p className="font-medium text-blue-800 mb-2">📱 Mobile Features:</p>
          <ul className="text-blue-700 space-y-1">
            <li>• Vibration alerts for important notifications</li>
            <li>• Smart sound management (respects device settings)</li>
            <li>• Offline notification queuing</li>
            <li>• Battery-optimized delivery</li>
          </ul>
        </div>

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Professional notifications for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Order confirmations and status updates</li>
            <li>Delivery tracking and arrival notifications</li>
            <li>New product arrivals and special offers</li>
            <li>Store updates and important announcements</li>
            <li>Account approvals and verifications</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}