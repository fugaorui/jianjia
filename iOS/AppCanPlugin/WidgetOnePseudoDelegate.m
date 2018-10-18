/*
 *  Copyright (C) 2014 The AppCan Open Source Project.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

#import "WidgetOnePseudoDelegate.h"
#import "LQJCreateFolder.h"
#import "ATAppUpdater.h"
#import <AdSupport/AdSupport.h>
#import "EUExJPush.h"
// 引入JPush功能所需头文件
#import "JPUSHService.h"
// iOS10注册APNs所需头文件
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif


@interface WidgetOnePseudoDelegate ()<JPUSHRegisterDelegate>
{

}
@end

@implementation WidgetOnePseudoDelegate




- (id) init
{
	if (self = [super init]) {
		self.userStartReport = NO;
		self.useOpenControl = NO;
		self.useEmmControl = NO;
		self.usePushControl = NO;
		self.useUpdateControl = NO;
		self.useOnlineArgsControl = YES;
		self.useDataStatisticsControl = NO;
        self.useAuthorsizeIDControl = NO;
        self.useCloseAppWithJaibroken = NO;
        self.useRC4EncryptWithLocalstorage = YES;
        self.useUpdateWgtHtmlControl = NO;
        self.useStartReportURL = @"http://192.168.1.140:8080/dc/";
        self.useAnalysisDataURL = @"http://192.168.1.140:8080/dc/";
        self.useBindUserPushURL = @"http://192.168.1.140:8080/push/";
        self.useAppCanMAMURL = @"http://192.168.1.140:8080/mam/";
        self.useAppCanMCMURL = @"http://192.168.1.183:8443/mcmIn/";
        self.useAppCanMDMURL = @"http://192.168.1.183:8443/mdmIn/";
        self.useAppCanMDMURLControl = NO;
        self.useCertificatePassWord = @"123456";
        self.useCertificateControl = NO;
        self.useIsHiddenStatusBarControl = NO;
        self.useAppCanUpdateURL = @"";
        self.signVerifyControl = NO;
        
        self.useAppCanEMMTenantID = @"";
        self.useAppCanAppStoreHost = @"";
        self.useAppCanMBaaSHost = @"";
        self.useAppCanIMXMPPHost = @"";
        self.useAppCanIMHTTPHost = @"";
        self.useAppCanTaskSubmitSSOHost = @"";
        self.useAppCanTaskSubmitHost = @"";
        self.validatesSecureCertificate = NO;
	}
	return self;
}


-(void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler{
    
    NSDictionary * userInfo = notification.request.content.userInfo;
    if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        [JPUSHService handleRemoteNotification:userInfo];
    }
    completionHandler(UNNotificationPresentationOptionAlert); // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
    
}

-(void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler{
    
    NSDictionary * userInfo = response.notification.request.content.userInfo;
    if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        [JPUSHService handleRemoteNotification:userInfo];
    }
    completionHandler();  // 系统要求执行这个方法
    
}

- (void)showAlertView{
    if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"推送" message:@"推送" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *action = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:nil];
        [alert addAction:action];
        [self.window.rootViewController showDetailViewController:alert sender:nil];
        
    }else{
        
        UIAlertView *alert=[[UIAlertView alloc]initWithTitle:@"推送" message:@"推送" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
        alert.alertViewStyle=UIAlertViewStyleDefault;
        [alert show];
        
    }
    
    
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    
#pragma mark 推送
    NSDictionary *remoteNotification = [launchOptions objectForKey: UIApplicationLaunchOptionsRemoteNotificationKey];
    
    NSLog(@"%@",remoteNotification);
    
    
    dispatch_async(dispatch_queue_create("推送", DISPATCH_QUEUE_CONCURRENT), ^{
        
        JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
        entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound;
        if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
            // 可以添加自定义categories
            // NSSet<UNNotificationCategory *> *categories for iOS10 or later
            // NSSet<UIUserNotificationCategory *> *categories for iOS8 and iOS9
        }
        [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
        
        NSString *advertisingId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
        
        // Required
        // init Push
        // notice: 2.1.5版本的SDK新增的注册方法，改成可上报IDFA，如果没有使用IDFA直接传nil
        // 如需继续使用pushConfig.plist文件声明appKey等配置内容，请依旧使用[JPUSHService setupWithOption:launchOptions]方式初始化。
        [JPUSHService setupWithOption:launchOptions appKey:@"96b4b2f3707509f9ebc9b30f"
                              channel:@"layerOA_channel"
                     apsForProduction:0
                advertisingIdentifier:advertisingId];
    });
    

    
    
    
#pragma mark 文件
    
//    创建文件夹
    NSString *documentPath=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    NSArray <NSString *>*name=@[@"doc",@"xls",@"ppt",@"pdf"];
    
    NSMutableArray *path=[NSMutableArray array];
    NSFileManager* fm=[NSFileManager defaultManager];
    
    
    
    NSString *createPath=[documentPath stringByAppendingPathComponent:name[1]];
    
    if (![fm fileExistsAtPath:createPath]) {
        for (int i=0; i<name.count; i++) {
            [LQJCreateFolder createFolderAtDocument:name[i]];
            
        }
        for (int j=0; j<name.count; j++) {
            NSArray *files = [fm subpathsAtPath:documentPath];
            NSString *createPath=[documentPath stringByAppendingPathComponent:files[j]];
            
            [path addObject:createPath];
        }
        
//        NSLog(@"创建成功");
//        NSLog(@"%@",path);
    }
    dispatch_async(dispatch_queue_create("qingl", DISPATCH_QUEUE_CONCURRENT), ^{
        EUExJPush *jp=[[EUExJPush alloc]init];
        [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
        
        [[UIApplication sharedApplication] cancelAllLocalNotifications];
        
        [JPUSHService resetBadge];
        [jp setBadgeNumber:[NSMutableArray arrayWithObject:@0]];
    });
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent animated:NO];
	return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
    return [super application:application handleOpenURL:url];
}
- (void)applicationWillResignActive:(UIApplication *)application {
    
	[super applicationWillResignActive:application];

}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    [super applicationDidBecomeActive:application];
    dispatch_async(dispatch_queue_create("qingl", DISPATCH_QUEUE_CONCURRENT), ^{
        EUExJPush *jp=[[EUExJPush alloc]init];
        [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
        
        [[UIApplication sharedApplication] cancelAllLocalNotifications];
        
        [JPUSHService resetBadge];
        [jp setBadgeNumber:[NSMutableArray arrayWithObject:@0]];
    });


}

- (void)applicationWillTerminate:(UIApplication *)application {
	[super applicationWillTerminate:application];
}
- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [JPUSHService registerDeviceToken:deviceToken];
	[super application:app didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
	
}
// 注册APNs错误

//应用即将进入前台时，设置应用角标为0并清空JPush服务器中存储的badge值

- (void)applicationWillEnterForeground:(UIApplication *)application {
    
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    

    
}



- (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)err {
    
	[super application:app didFailToRegisterForRemoteNotificationsWithError:err];
//    NSLog(@"did Fail To Register For Remote Notifications With Error: %@", err);

}
// 接收推送通知

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
//    [JPUSHService handleRemoteNotification:userInfo];
    
    [super application:application didReceiveRemoteNotification:userInfo];
}

-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler: (void (^)(UIBackgroundFetchResult))completionHandler
{
    [JPUSHService handleRemoteNotification:userInfo];
    EUExJPush *jp=[[EUExJPush alloc]init];
    [jp callBackType:userInfo];
    
    completionHandler(UIBackgroundFetchResultNewData);
    
}






@end
