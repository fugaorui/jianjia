//
//  EUExUpdate.m
//  TipSoft
//
//  Created by 罗啟杰 on 2017/3/7.
//  Copyright © 2017年 zywx. All rights reserved.
//

#import "EUExUpdate.h"
#import "ATAppUpdater.h"

@implementation EUExUpdate

-(void)checkVersion:(NSMutableArray *)params{

    [[ATAppUpdater sharedUpdater] showUpdateWithConfirmation];

}

-(void)getVersionNumber:(NSMutableArray *)params{

    
    dispatch_async(dispatch_queue_create("banben", DISPATCH_QUEUE_CONCURRENT), ^{
        NSString *version=[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
//        float ver=[version floatValue];
//        NSNumber *number=[NSNumber numberWithFloat:ver];

//        AppCanRootWebViewEngine()
    
        [self.webViewEngine callbackWithFunctionKeyPath:@"uexUpdate.cbVersionNumber" arguments:ACArgsPack(version) completion:^(JSValue * _Nullable returnValue) {
            
        }];
    });


}
    
-(void)getDevice:(NSMutableArray *)params{
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad)
    {
        [self.webViewEngine callbackWithFunctionKeyPath:@"uexUpdate.cbDevice" arguments:ACArgsPack(@"iPad") completion:^(JSValue * _Nullable returnValue) {
            
        }];
    }else{
        [self.webViewEngine callbackWithFunctionKeyPath:@"uexUpdate.cbDevice" arguments:ACArgsPack(@"iPhone") completion:^(JSValue * _Nullable returnValue) {
            
        }];

    }
    
}
    
@end
