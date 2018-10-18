//
//  EUExCall.m
//  AppCan
//
//  Created by AppCan on 11-8-25.
//  Copyright 2011 AppCan. All rights reserved.
//

#import "EUExCall.h"
#import "EUtility.h"
#import "EUExBaseDefine.h"

@implementation EUExCall
@synthesize phoneNumber;

//-(id)initWithBrwView:(EBrowserView *) eInBrwView {	
//	if (self = [super initWithBrwView:eInBrwView]) {
//	}
//	return self;
//}

//-(void)dealloc {
//	[callWebView release];
//	callWebView = nil;
//	[phoneNumber release];
//	phoneNumber = nil;
//	[super dealloc];
//}

//-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
//	if (buttonIndex == 1) {
//		[[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel://%@",phoneNumber]]];
//	} 
//}

-(void)call:(NSMutableArray *)inArguments {
	NSString * phoneNum = [inArguments objectAtIndex:0];
	//直接拨打电话	
	if (phoneNum == nil) {
		//[super jsFailedWithOpId:0 errorCode:1020101 errorDes:UEX_ERROR_DESCRIBE_ARGS];
		return;
	}
	self.phoneNumber = [NSString stringWithString:phoneNum];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel://%@",phoneNumber]]];
    
//	UIAlertView * smsAlert = [[UIAlertView alloc] initWithTitle:@"提示" message:@"应用程序需要拨打电话,是否确定拨号?" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"确定",nil];
//	[smsAlert show];
//	[smsAlert release];
//	smsAlert = nil;

}

-(void)dial:(NSMutableArray *)inArguments {
	NSString * phoneNum = [inArguments objectAtIndex:0];
	//跳转到打电话界面
	if (phoneNum == nil) {
		//[super jsFailedWithOpId:0 errorCode:1020201 errorDes:UEX_ERROR_DESCRIBE_ARGS];
	}
	callWebView = [[UIWebView alloc] initWithFrame:CGRectZero];
	[callWebView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel://%@",phoneNum]]]];
}

-(void)facetime:(NSMutableArray *)inArguments{
	NSString * faceTimeNum = [inArguments objectAtIndex:0];
	NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"facetime://%@",faceTimeNum]];
	if ([[UIApplication sharedApplication] canOpenURL:url]) {
		[[UIApplication sharedApplication] openURL:url];
	}
}
@end
