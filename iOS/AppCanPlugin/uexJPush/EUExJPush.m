//
//  EUExJPush.m
//  EUExJPush
//
//  Created by liukangli on 15/5/18.
//  Copyright (c) 2015年 AppCan. All rights reserved.
//

#import "EUExJPush.h"
#import "JPushInstance.h"

@interface EUExJPush()
@property (nonatomic,weak) JPushInstance *JPush;
@end
@implementation EUExJPush
- (instancetype)initWithWebViewEngine:(id<AppCanWebViewEngineObject>)engine{
    if (self = [super initWithWebViewEngine:engine]) {
        
        if(self){
            _JPush = [JPushInstance sharedInstance];
            
        }
    }
    return self;
}

+(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
    
    [[JPushInstance sharedInstance] notifyApplication:application didFinishLaunchingWithOptions:launchOptions];
    return YES;
}

+(void)rootPageDidFinishLoading{
    [[JPushInstance sharedInstance] notifyRootPageDidFinishLoading];
}



+ (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [[JPushInstance sharedInstance]notifyApplication:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];

}

+(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
     [[JPushInstance sharedInstance] notifyApplication:application didReceiveRemoteNotification:userInfo];
   
}

+ (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler: (void (^)(UIBackgroundFetchResult))completionHandler {
    
    
//    JPUSHService *jp=[[JPUSHService alloc]init];
//    NSDictionary *dic=[jp paa]
//    
    
    [[JPushInstance sharedInstance] notifyApplication:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
    

    
}

+ (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
    [[JPushInstance sharedInstance] notifyApplication:application didReceiveLocalNotification:notification];

}


//-(void)setBadgeNumber:(NSInteger)count{
//    [[UIApplication sharedApplication]applicationIconBadgeNumber];
//
//}



- (void)init:(NSMutableArray *)inArguments{

}

- (void)setAlias: (NSString *)alias tags:(NSSet *)tags callbackKeyPath:(NSString *)keypath callbackFunction:(ACJSFunctionRef *)function{
    [JPUSHService setTags:tags alias:alias fetchCompletionHandle:^(int iResCode, NSSet *iTags, NSString *iAlias) {
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        [dict setValue:@(iResCode) forKey:@"result"];
        [dict setValue:iAlias forKey:@"alias"];
        [dict setValue:iTags.allObjects forKey:@"tags"];
//        [AppCanRootWebViewEngine() callbackWithFunctionKeyPath:keypath arguments:ACArgsPack(dict.ac_JSONFragment) completion:nil];
        [self.webViewEngine callbackWithFunctionKeyPath:keypath arguments:ACArgsPack(@"no",@"no",dict.ac_JSONFragment) completion:^(JSValue * _Nullable returnValue) {
            
        }];
        [function executeWithArguments:ACArgsPack(@(iResCode),dict)];
    }];
}





- (void)setAliasAndTags:(NSMutableArray *)inArguments{
    ACArgsUnpack(NSDictionary *info) = inArguments;
    ACJSFunctionRef *callback = JSFunctionArg(inArguments.lastObject);
    NSString *alias = stringArg(info[@"alias"]);
    NSArray *tags = arrayArg(info[@"tags"]);
    UEX_PARAM_GUARD_NOT_NIL(alias);
    UEX_PARAM_GUARD_NOT_NIL(tags);
    [self setAlias:alias tags:[NSSet setWithArray:tags] callbackKeyPath:@"uexJPush.cbSetAliasAndTags" callbackFunction:callback];
}




- (void)setAlias:(NSMutableArray *)inArguments{
    ACArgsUnpack(NSDictionary *info) = inArguments;
    ACJSFunctionRef *callback = JSFunctionArg(inArguments.lastObject);
    NSString *alias = stringArg(info[@"alias"]);
    UEX_PARAM_GUARD_NOT_NIL(alias);
    [self setAlias:alias tags:nil callbackKeyPath:@"uexJPush.cbSetAlias" callbackFunction:callback];
    
    
}



- (void)setTags:(NSMutableArray *)inArguments{
    ACArgsUnpack(NSDictionary *info) = inArguments;
    ACJSFunctionRef *callback = JSFunctionArg(inArguments.lastObject);
    NSArray *tags = arrayArg(info[@"tags"]);
    UEX_PARAM_GUARD_NOT_NIL(tags);
    [self setAlias:nil tags:[NSSet setWithArray:tags] callbackKeyPath:@"uexJPush.cbSetTags" callbackFunction:callback];
    
    
}



- (NSString *)getRegistrationID:(NSMutableArray *)inArguments{
    NSMutableDictionary *dict=[NSMutableDictionary dictionary];
    NSString *registrationID = [JPUSHService registrationID];
    [dict setValue:registrationID forKey:@"registrationID"];
//    [AppCanRootWebViewEngine() callbackWithFunctionKeyPath:@"uexJPush.cbGetRegistrationID" arguments:ACArgsPack(dict.ac_JSONFragment)];
    
    [self.webViewEngine callbackWithFunctionKeyPath:@"uexJPush.cbGetRegistrationID" arguments:ACArgsPack(@"0",@"0",dict.ac_JSONFragment) completion:^(JSValue * _Nullable returnValue) {
        
    }];
    
    return registrationID;
}




- (void)getConnectionState:(NSMutableArray *)inArguments{
    
    ACJSFunctionRef *callback = JSFunctionArg(inArguments.lastObject);
    NSNumber *state = _JPush.connectionState ? @0 : @1;
    NSMutableDictionary *dict =[NSMutableDictionary dictionary];
    [dict setValue:state forKey:@"result"];
    [AppCanRootWebViewEngine() callbackWithFunctionKeyPath:@"uexJPush.cbGetConnectionState" arguments:ACArgsPack(dict.ac_JSONFragment)];
    [callback executeWithArguments:ACArgsPack(state)];
    
}



- (void)addLocalNotification:(NSMutableArray *)inArguments{
    

    ACArgsUnpack(NSDictionary *info) = inArguments;
    UEX_PARAM_GUARD_NOT_NIL(info);
    
    [_JPush addLocalNotificationWithTimeInterval: numberArg(info[@"broadCastTime"]).doubleValue/1000
                                   notificationId:stringArg(info[@"notificationId"]) ?: @"-1"
                                          content:stringArg(info[@"content"]) ?: @""
                                           extras:dictionaryArg(info[@"extras"])
                                            title:stringArg(info[@"title"]) ?: @""];

    
}




- (void)removeLocalNotification:(NSMutableArray *)inArguments{
    ACArgsUnpack(NSDictionary *info) = inArguments;
    NSString *notificationId = stringArg(info[@"notificationId"]);
    [_JPush removeLocalNotificationWithID:notificationId];
}



- (void)clearLocalNotifications:(NSMutableArray *)inArguments{
    [_JPush removeAllLocalNotifications];
    
    
}


- (void)setBadgeNumber:(NSMutableArray *)inArguments{
    ACArgsUnpack(NSNumber *number) = inArguments;
    [_JPush setBadgeNumber:number.integerValue];
}

- (void)disableLocalNotificationAlertView:(NSMutableArray *)inArguments{
    ACArgsUnpack(NSNumber *flag) = inArguments;
    UEX_PARAM_GUARD_NOT_NIL(flag);
    [JPushInstance sharedInstance].showNotificationAlertInForeground = !flag.boolValue;
}


- (void)showNotificationAlertInForeground:(NSMutableArray *)inArguments{
    ACArgsUnpack(NSNumber *flag) = inArguments;
    UEX_PARAM_GUARD_NOT_NIL(flag)
    [JPushInstance sharedInstance].showNotificationAlertInForeground = flag.boolValue;
}

-(void)callBackType:(NSDictionary *)dict{
    if (dict) {
        NSString *modelType;
        modelType = [dict valueForKey:@"type"];
        
        int typeint=[modelType intValue];
        NSString *code=@"";
        NSString *type=@"";
        NSNumber *data=[NSNumber numberWithInt:typeint];
        
        //        [self.webViewEngine callbackWithFunctionKeyPath:@"uexJPush.onReceiveNotificationOpen" arguments:ACArgsPack(code,type,data)];
        [self.webViewEngine callbackWithFunctionKeyPath:@"uexJPush.onReceiveNotificationOpen" arguments:ACArgsPack(code,type,data) completion:^(JSValue * _Nullable returnValue) {
            
        }];
    }else{
        return;
    }
    
}

@end
