//
//  EUExCall.h
//  testjs1
//
//  Created by AppCan on 11-8-25.
//  Copyright 2011 AppCan. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AppCanKit/AppCanKit.h>

@interface EUExCall : EUExBase {
	UIWebView *callWebView;
	NSString *phoneNumber;
}
@property (nonatomic,retain) NSString * phoneNumber;
@end
